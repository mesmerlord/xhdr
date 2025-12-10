# AdMakeAI - Claude Code Conventions

## Project Overview
AdMakeAI is an AI-powered advertisement image generation platform. Users can create professional ad images using AI models (FAL AI's nano banana pro and seedream 3 edit).

**Domain**: admakeai.com

## Tech Stack
- **Framework**: Next.js 15 (Pages Router only - NO App Router)
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis for background jobs
- **Auth**: NextAuth.js with Google OAuth and credentials
- **Payments**: Stripe subscriptions ($39/$79/$139 monthly plans)
- **AI**: FAL AI (nano banana pro, seedream 3 edit) and Runware API
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS with shadcn/ui components
- **Monitoring**: Sentry for error tracking
- **Deployment**: Docker with Traefik reverse proxy

## Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Footer.tsx
│   ├── Seo.tsx
│   └── ClickableVideo.tsx
├── constants/          # App constants
│   ├── pricing.ts      # Subscription plans
│   └── good_emails.ts  # Valid email domains
├── emails/             # React Email templates
├── lib/                # Utilities
│   ├── constants.ts    # Routes and footer links
│   ├── utils.ts        # Helper functions (cn)
│   ├── fal-client.ts   # FAL AI client
│   └── runware-client.ts
├── pages/              # Next.js pages
│   ├── api/
│   │   ├── auth/[...nextauth].ts
│   │   ├── trpc/[trpc].ts
│   │   ├── fal/proxy.ts
│   │   └── webhooks/stripe.ts
│   ├── tools/
│   │   └── ad-generator.tsx
│   ├── index.tsx       # Landing page
│   ├── pricing.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── dashboard.tsx
│   └── verify-email.tsx
├── queue/              # BullMQ queues and workers
│   ├── queues.ts
│   ├── worker.ts
│   └── workers/
│       ├── ad-generation.worker.ts
│       ├── email.worker.ts
│       └── subscription.worker.ts
├── routers/            # tRPC routers
│   ├── user.ts
│   ├── upload.ts
│   └── adGeneration.ts
├── server/             # Server utilities
│   ├── root.ts         # tRPC app router
│   ├── trpc.ts         # tRPC context
│   └── utils/
│       ├── auth.ts
│       ├── db.ts
│       ├── redis.ts
│       └── s3.ts
├── styles/
│   └── globals.css     # Tailwind + custom styles
└── utils/
    └── trpc.ts         # tRPC client
```

## Key Conventions

### Pages Router Only
- All pages use the Pages Router (`/pages` directory)
- NO App Router components or patterns
- API routes in `/pages/api/`

### tRPC Usage
- All API endpoints defined as tRPC procedures
- Routers in `/src/routers/`
- Combined in `/src/server/root.ts`
- Client in `/src/utils/trpc.ts`

### Database
- Prisma schema in `/prisma/schema.prisma`
- Always use `prisma` client from `/src/server/utils/db.ts`

### Queues
- Queue definitions in `/src/queue/queues.ts`
- Workers in `/src/queue/workers/`
- Worker entry in `/src/queue/worker.ts`
- Run with: `npx tsx src/queue/worker.ts`

### Authentication
- NextAuth config in `/pages/api/auth/[...nextauth].ts`
- Use `useSession()` hook for client-side auth
- Use `getServerAuthSession()` for server-side auth

### Styling
- Tailwind with custom orange/purple color scheme
- Use `cn()` utility for conditional classes
- shadcn/ui components in `/src/components/ui/`

## AI Models
- **Text-to-Image**: `fal-ai/nano-banana-pro`
- **Image-to-Image**: `fal-ai/seedream-3-edit`

## Subscription Plans
| Plan | Price (Monthly) | Credits |
|------|----------------|---------|
| Starter | $39 | 500 |
| Professional | $79 | 1,500 |
| Business | $139 | 4,000 |

## Commands
```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma generate
npx prisma db push
npx prisma migrate dev

# Worker
npm run worker

# Create Stripe products
npx tsx scripts/create-stripe-products.ts

# Deploy
./deploy.sh
```

## Environment Variables
See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `NEXTAUTH_SECRET` - Auth secret
- `GOOGLE_CLIENT_ID/SECRET` - OAuth credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `FAL_KEY` - FAL AI API key
- `RUNWARE_API_KEY` - Runware API key
- `RESEND_API_KEY` - Email API key
- `SENTRY_DSN` - Error tracking
