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

## Contact form email

`POST /api/contact` sends the form and up to 5 attachments (3 MB total) to
`senireligi@ub.ac.id`. It uses SMTP; no email is sent until server configuration
is supplied. The thank-you dialog appears only after the SMTP server accepts
the recipient. Acceptance is not proof of inbox delivery.

Ask campus IT for an authorized website sender and SMTP credentials. Put these
in `.env.local` for development and the hosting provider's environment settings
for production (never use `NEXT_PUBLIC_` or commit credentials):

```dotenv
CONTACT_SMTP_HOST=SMTP_HOST_FROM_CAMPUS_IT
CONTACT_SMTP_PORT=587
CONTACT_SMTP_USER=SMTP_USERNAME
CONTACT_SMTP_PASSWORD=SMTP_PASSWORD
CONTACT_FROM=AUTHORIZED_SENDER_ADDRESS
```

Port 587 requires STARTTLS; port 465 uses implicit TLS. This adapter uses SMTP
username/password authentication; if campus IT requires OAuth or an internal
relay, adapt authentication to their policy before activation. The recipient
does not need to match the sender. Reply-To is the visitor's validated email.

The route validates sizes, fields and file extensions, uses a honeypot, and
has in-process rate limiting and retry deduplication. Configure rate limiting
at the hosting proxy for `/api/contact` in production; multi-instance deployments
need shared storage for global limits and deduplication. SMTP does not guarantee
exactly-once delivery after network timeouts. Uploaded files are forwarded as
attachments, not published or saved by this application.

Verify a real delivery and reply using an authorized test before publishing
the form. Without configuration, the form reports unavailability and preserves
the visitor's input. Route tests mock SMTP and never send external email.

Run contact endpoint tests with `node --test app/api/contact/route.test.mjs`.

## Next.js resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
