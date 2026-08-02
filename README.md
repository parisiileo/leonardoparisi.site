Personal portfolio of Leonardo Parisi — a single scrolling page in four
languages, built with Next.js (App Router), Tailwind CSS v4, next-intl and
Framer Motion.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in the values you need
npm run dev
```

Nothing in `.env.local` is required to render the site: with Resend
unconfigured, the contact form falls back to opening the visitor's own mail
client with the message prefilled.

## Contact form

Enquiries are emailed straight to the inbox — no database, nothing to log
into. `POST /api/contact` validates the payload, drops anything that filled
the hidden honeypot field, rate-limits the caller and hands the message to
Resend with `reply_to` set to the sender, so replying happens in one click.

1. Verify the domain in Resend (DNS records for SPF and DKIM), otherwise mail
   from `@imleo.it` will not send.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and
   `CONTACT_IP_SALT`.

Rate limiting lives in `src/lib/rateLimit.ts` and counts in process memory: it
throttles per warm serverless instance rather than globally, which blunts a
burst but is not a hard quota. Swapping it for a shared counter (Upstash Redis
free tier) means changing that one file.

## Legal pages

`/privacy`, `/cookie` and `/terms` exist in all four languages. The copy lives
under the `legal` key of `messages/<locale>.json` and is rendered by
`src/components/layout/LegalPage.tsx`; adding a clause means editing four
files and nothing else. They are listed in the sitemap and linked from the
footer of every page.

The site sets no profiling cookies and loads no third-party scripts, which is
why there is no consent banner — see the cookie policy. Adding analytics that
does set cookies would change that.

## Structure

```
src/app/[locale]        the scrolling page and the legal routes
src/app/api/contact     form endpoint: validation, rate limit, send
src/components/sections one component per section of the page
src/lib/sections.ts     section registry: accent hue and running number
messages/               all copy, four languages
```
