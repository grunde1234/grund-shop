# AGENTS.md

## Product

**Grundstore** is an e-commerce web app. Shoppers browse products, add to a cart
(guests supported via a `sessionCartId` cookie), then check out through shipping
address → payment method → place order, paying with PayPal. Authenticated users
get a profile and order history. Admins get a dashboard (overview charts,
product CRUD, users, orders).

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components, Turbopack)
- **Language:** TypeScript (strict), React 19
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york), Radix UI, lucide icons,
  `next-themes` (dark mode), `sonner` toasts
- **Database:** PostgreSQL via Prisma ORM (Neon serverless adapter); client is
  generated to `src/generated/prisma`
- **Auth:** NextAuth v5 with Prisma adapter, JWT sessions, credentials provider
  (`bcrypt-ts-edge`)
- **Forms & validation:** `react-hook-form` + Zod
- **Payments:** PayPal · **Uploads:** UploadThing
- **Tests:** Jest + ts-jest

## Layout

- `src/app` — routes (route groups: `(auth)`, `(rs)` storefront, `admin`, `user`)
- `src/components` — `ui/` (shadcn), `shared/`, `admin/`
- `src/lib/actions` — server actions (data mutations/queries)
- `prisma/` — schema & migrations · `db/` — Prisma client & seed

## Conventions

- Import alias: `@/*` → `src/*`
- Prefer Server Components and server actions; mark client files with `"use client"`
- Prisma: models `PascalCase`, fields `camelCase`; auto-generated relations are
  lowercased + pluralized by Prisma (see `naming.md`)
- Add shadcn primitives to `src/components/ui`; don't hand-roll equivalents
- Validate inputs with Zod schemas before hitting the DB
- Never commit secrets; config lives in env vars (see `src/lib/constants`)

## Commands

```bash
npm run dev     # dev server (http://localhost:3000)
npm run build   # production build
npm run lint    # eslint
npm test        # jest
```

Run `npm run lint` and `npm test` before opening a PR.
