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

## Blog Posts

### Structure
- Blog pages in `/src/pages/blog/`
- Use `BlogLayout` component from `/src/components/layout/BlogLayout.tsx`
- Blog data in `/src/lib/blogData.ts` - add new posts here for the index page
- Hero images in `/public/blog-images/`
- Example profile pictures in `/public/example-profiles/`

### Hero Images
Every blog post MUST have a hero image generated with Z-Image Turbo (`fal-ai/z-image/turbo`).

**Important constraints for Z-Image Turbo:**
- Use simplistic, graphic designs - NOT photorealistic scenes
- Good: abstract gradients, tech infographic style, minimal geometric shapes
- Bad: complex realistic scenes, multiple people, detailed environments
- Size: 1280×720 for hero images, 512×512 for profile pictures
- When generating people: ALWAYS specify race/ethnicity to avoid generic outputs

Generate hero images with: `npx tsx scripts/generate-blog-heroes.ts`

### Example prompts that work well:
```
"Minimalist graphic design showing a glowing circular profile picture frame with orange and pink gradient rim light against dark gray background, abstract light rays emanating outward, clean modern tech aesthetic, wide banner format"

"Split comparison graphic showing same circular portrait silhouette, left side dim and flat labeled 'SDR', right side glowing bright with orange highlights labeled 'HDR', dark background with subtle gradient, tech infographic style"
```

### Creating New Blog Posts
1. Add entry to `/src/lib/blogData.ts`
2. Create page in `/src/pages/blog/[slug].tsx`
3. Use `BlogLayout` with POST_DATA object containing: title, description, date, readTime, category, image
4. Generate hero image using the script or add to script and run
5. Update Footer if needed
