# BlindsFold Website — MVP v1

Premium, mobile-first lead-generation website for **BlindsFold**, serving Winnipeg and surrounding areas.

## Current build

- Static front-end only: HTML, CSS and vanilla JavaScript
- No database
- No payment/checkout
- Responsive desktop/tablet/mobile layout
- Guided 5-step quote funnel
- Call, text and email actions
- 8 SEO-focused pages
- Local SEO metadata, sitemap and robots.txt
- Google Analytics 4 + Microsoft Clarity hooks ready to configure
- Formspree-compatible quote submission logic ready to configure
- User-provided blind imagery converted to optimized WebP
- Honest gallery/review placeholders; no fake customer projects or testimonials

## Pages

- `/` — Homepage
- `/blinds/` — Blind styles overview
- `/zebra-blinds-winnipeg/`
- `/roller-blinds-winnipeg/`
- `/blackout-blinds-winnipeg/`
- `/motorized-blinds-winnipeg/`
- `/about/`
- `/contact/`

## Contact details currently configured

- Phone/Text: `431-788-5688`
- Email: `awaisahmed4984@gmail.com`
- Service area: Winnipeg & surrounding areas

These can be changed later by searching the project for the old value and replacing it.

## Local preview

### Mac Terminal

From the folder that contains `blindsfold-website`:

```bash
cd blindsfold-website
python3 -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

Press `Control + C` in the terminal to stop the local server.

### VS Code Terminal

The exact same command can be used in VS Code's integrated terminal:

```bash
python3 -m http.server 3000
```

## Quote form setup

The front-end form is complete, but production email delivery must be connected before launch.

1. Create a form in Formspree.
2. Copy the endpoint, for example `https://formspree.io/f/FORM_ID`.
3. Open `assets/js/config.js`.
4. Set:

```js
formEndpoint: "https://formspree.io/f/FORM_ID"
```

5. Submit a test quote from the live site and verify the email arrives.

**Photo uploads:** Formspree currently makes native file uploads available on paid Personal/Professional/Business plans. If the MVP stays on a free form plan, either remove the upload field before launch or tell customers to text photos to 431-788-5688.

## Analytics setup

Open `assets/js/config.js` and set:

```js
gaMeasurementId: "G-XXXXXXXXXX",
clarityProjectId: "YOUR_CLARITY_PROJECT_ID"
```

Built-in tracked events include:

- `quote_cta_clicked`
- `quote_started`
- `quote_step_completed`
- `quote_submitted`
- `phone_clicked`
- `text_clicked`
- `email_clicked`

Google Search Console is configured separately after the site/domain is live, usually by DNS verification.

## Deploy to Vercel

1. Put this project in a GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: **Other** / static site.
5. No build command is required.
6. Deploy.
7. Test the temporary `*.vercel.app` URL.
8. In Vercel project settings, add `blindsfold.com` and `www.blindsfold.com`.
9. Add the DNS records Vercel provides at the domain registrar.
10. Retest HTTPS, all navigation, quote submission, call/text links and mobile layout.

## Before production launch

- Confirm exact business policies and FAQ wording.
- Connect and test the quote endpoint.
- Decide whether photo upload is enabled or customers should text photos.
- Configure GA4 and Clarity.
- Verify Google Search Console.
- Add actual Instagram/Facebook/TikTok URLs when accounts are ready.
- Add a privacy policy appropriate to the final analytics/form setup.
- Replace inspiration imagery with genuine BlindsFold project photos over time.
- Add genuine reviews only when available.
- Confirm domain ownership and DNS.

## Design references

The `docs/` directory contains desktop and mobile design reference mockups used for this MVP.
