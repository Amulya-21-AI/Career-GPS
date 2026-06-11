# Career GPS 🧭

**Discover career paths you didn't know existed.**

Career GPS is an AI-assisted career discovery and gap analysis platform. Users complete a smart quiz and receive personalized career matches across conventional, unconventional, niche, and emerging paths — with skill gap analysis, learning roadmaps, and 90-day action plans.

## Quick Start

```bash
cd career-gps
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** · **Zustand** · **Lucide React**
- **Custom scoring algorithm** (no AI required)
- **Anthropic SDK** (optional AI enhancement)

## Key Files

| Path | Purpose |
|------|---------|
| `src/data/careers-part*.ts` | 60+ career profiles |
| `src/lib/matching.ts` | Scoring algorithm |
| `src/store/quizStore.ts` | Quiz + saved state |
| `src/app/quiz/page.tsx` | Multi-step quiz |
| `src/app/report/page.tsx` | GPS Report |
| `src/app/careers/page.tsx` | Career explorer |
| `src/app/compare/page.tsx` | Side-by-side comparison |
| `src/app/admin/page.tsx` | Admin (password protected) |

## Features

- 10-step smart quiz (20+ data points)
- 60+ career profiles (conventional, unconventional, emerging, niche)
- Transparent scoring algorithm (10 weighted factors)
- Career GPS Report: top/safe/wildcard/stretch matches, skill gaps, action plans
- Career detail pages with resources, salary, timelines
- Compare up to 3 careers side-by-side
- Save careers (localStorage)
- Admin dashboard (password: `careergps-admin-2026`)

## Admin Access

Visit `/admin` · Default password: `careergps-admin-2026`

## Disclaimer

Career GPS helps you explore options. It does not make life decisions for you.

## Getting Started (original)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
