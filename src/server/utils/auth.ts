import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/server/utils/db";
import bcrypt from "bcryptjs";
import { routes } from "@/lib/constants";
import { FREE_CREDITS } from "@/constants/pricing";
import { CreditReason, UserRole } from "@prisma/client";
import { scheduleWelcomeEmail } from "@/queue/lib/email";

// List of temporary email domains
const TEMP_EMAIL_DOMAINS = [
  "10minutemail.com",
  "tempmail.org",
  "guerrillamail.com",
  "temp-mail.org",
  "throwaway.email",
  "mailinator.com",
  "getnada.com",
  "temp-mail.io",
  "disposablemail.com",
  "yopmail.com",
  "maildrop.cc",
  "tempmailo.com",
];

// Helper function to check if domain is banned
async function isDomainBanned(domain: string) {
  try {
    const bannedDomain = await prisma.bannedDomain.findUnique({
      where: { domain },
    });

    const isTempEmail = TEMP_EMAIL_DOMAINS.includes(domain);

    return {
      banned: !!bannedDomain || isTempEmail,
      reason:
        bannedDomain?.reason || (isTempEmail ? "Temporary email domain" : null),
    };
  } catch (error) {
    const isTempEmail = TEMP_EMAIL_DOMAINS.includes(domain);
    return {
      banned: isTempEmail,
      reason: isTempEmail ? "Temporary email domain" : null,
    };
  }
}

// Helper function to check if IP is banned
async function isIPBanned(ip: string) {
  try {
    const bannedIP = await prisma.bannedIP.findUnique({
      where: { ipAddress: ip },
    });

    return {
      banned: !!bannedIP,
      reason: bannedIP?.reason || null,
    };
  } catch (error) {
    return {
      banned: false,
      reason: null,
    };
  }
}

// Helper function to check if user should get free credits for temp email
async function checkAndAwardTempEmailCredits(userId: string, email: string) {
  const domain = email.split("@")[1];
  if (domain && TEMP_EMAIL_DOMAINS.includes(domain)) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (user) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: FREE_CREDITS } },
        }),
        prisma.userCreditHistory.create({
          data: {
            userId,
            credits: FREE_CREDITS,
            previousCredits: user.credits,
            newCredits: user.credits + FREE_CREDITS,
            reason: CreditReason.REGISTRATION_BONUS,
            reasonExtra: `User using temp email domain: ${domain}`,
          },
        }),
      ]);
    }
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      stripeCustomerId?: string | null;
      role?: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    stripeCustomerId?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check if email domain is banned
        const domain = credentials.email.split("@")[1];
        if (domain) {
          const domainCheck = await isDomainBanned(domain);
          if (domainCheck.banned) {
            throw new Error(`Email domain not allowed: ${domainCheck.reason}`);
          }
        }

        // Check if IP is banned
        const forwarded = req?.headers?.["x-real-ip"];
        const ip =
          typeof forwarded === "string"
            ? forwarded.split(",")[0]
            : req?.headers?.["x-real-ip"];

        if (ip && typeof ip === "string") {
          const ipCheck = await isIPBanned(ip);
          if (ipCheck.banned) {
            throw new Error(`Access denied: ${ipCheck.reason}`);
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          stripeCustomerId: user.stripeCustomerId,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    async createUser({ user }) {
      // Add registration bonus (free credits) to new users
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: FREE_CREDITS,
          emailVerified:
            user.email?.endsWith("@gmail.com") ||
            user.email?.includes("@google.com")
              ? new Date()
              : undefined,
        },
      });

      scheduleWelcomeEmail(user.id);

      if (user.email) {
        await checkAndAwardTempEmailCredits(user.id, user.email);
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      if (email?.verificationRequest) {
        return true;
      }

      const userEmail = user.email || profile?.email;
      if (userEmail) {
        const domain = userEmail.split("@")[1];
        if (domain) {
          const domainCheck = await isDomainBanned(domain);
          if (domainCheck.banned) {
            return false;
          }
        }
      }

      if (account?.provider === "google" && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (existingUser) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: profile.name || existingUser.name,
              image: profile.image || existingUser.image,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.stripeCustomerId = user.stripeCustomerId;
      }

      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        stripeCustomerId: token.stripeCustomerId,
        role: token.role,
      },
    }),
  },
  pages: {
    signIn: routes.auth.login,
    newUser: routes.auth.register,
    error: routes.auth.login,
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
