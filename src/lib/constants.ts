// All valid base routes for callback URL validation
export const ALL_BASE_ROUTES = [
  "/",
  "/dashboard",
  "/pricing",
  "/tools/ad-generator",
  "/tools/twitter-hdr",
];

export const routes = {
  home: "/",
  tools: {
    adGenerator: "/tools/ad-generator",
    twitterHdr: "/tools/twitter-hdr",
  },
  common: {
    pricing: "/pricing",
    dashboard: "/dashboard",
  },
  resources: {
    privacyPolicy: "/resources/privacy-policy",
    termsOfService: "/resources/terms-of-service",
    faq: "/resources/faq",
    contact: "mailto:support@admakeai.com",
  },
  auth: {
    login: "/login",
    register: "/register",
    verifyEmail: "/verify-email",
  },
};

export interface FooterLink {
  name: string;
  url: string;
}

export interface FooterSection {
  title: string;
  subFooters: FooterLink[];
}

export const FOOTER_LINKS: FooterSection[] = [
  {
    title: "Tools",
    subFooters: [
      { name: "AI Ad Generator", url: routes.tools.adGenerator },
      { name: "Twitter HDR", url: routes.tools.twitterHdr },
      { name: "Pricing", url: routes.common.pricing },
    ],
  },
  {
    title: "Resources",
    subFooters: [
      { name: "FAQ", url: routes.resources.faq },
      { name: "Privacy Policy", url: routes.resources.privacyPolicy },
      { name: "Terms Of Service", url: routes.resources.termsOfService },
      { name: "Contact Us", url: routes.resources.contact },
    ],
  },
];
