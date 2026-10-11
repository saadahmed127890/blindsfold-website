# BlindsFold domain and email setup (Cloudflare Pages)

Prepared 11 October 2026. `blindsfold.com` is registered via Cloudflare Registrar, and `info@blindsfold.com` is configured using Cloudflare Email Routing.

## Website Deployment: Cloudflare Pages

The repository is a static site with HTML pages, shared CSS/JavaScript, and static asset optimization via `_headers` and `_redirects`.

For Cloudflare Pages deployment:
1. **Repository & Framework:** Connect GitHub repository `blindsfold-website`. Build command: (None / empty). Build output directory: `/` (root directory).
2. **Custom Domain:** Add `blindsfold.com` as primary domain under Pages -> Custom Domains. Add `www.blindsfold.com` with a 301 redirect to `blindsfold.com`.
3. **DNS Automatic Configuration:** Cloudflare automatically updates the DNS `CNAME` / `ALIAS` records for `@` and `www` to point to Cloudflare Pages.
4. **Email Routing DNS untouched:** Existing Cloudflare Email Routing DNS records (`MX` and `TXT` SPF records) remain active and untouched.

## Business Email: info@blindsfold.com (Cloudflare Email Routing)

`info@blindsfold.com` is configured in Cloudflare Email Routing to forward to the destination email address.

## Formspree Notification Routing

- In Formspree dashboard, confirm the endpoint `https://formspree.io/f/mppzbjbk`.
- Update the target notification email to `info@blindsfold.com`.
- Formspree sends a verification email to `info@blindsfold.com`, which Cloudflare Email Routing forwards to the destination inbox.
- Click the verification link to authorize `info@blindsfold.com`.
- Submit a test quote from the live site to confirm end-to-end delivery.

