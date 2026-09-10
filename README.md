<p align="center">
  <img src="public/logo.png" alt="Description" width="200">
</p>


## for uploadthings flow 
```
Browser → uploads directly to UploadThing's storage (bytes never pass through your server)
Your server → only runs auth/middleware checks + saves the returned URL to your DB
UploadThing CDN → serves the file back out whenever it's requested
```
## What your server does do instead — just two small things:

* Before upload: the browser asks your server, "am I allowed to upload this?" Your server runs your .middleware() — checks auth, permissions, etc. — and if it's fine, just hands back permission (a signed URL) for the browser to upload directly to UploadThing.
* After upload: UploadThing tells your server "this file finished uploading, here's its URL" (that's your onUploadComplete/onClientUploadComplete callback). Your server just saves that URL string to your database.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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
