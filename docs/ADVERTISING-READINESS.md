# BlindsFold advertising readiness — November 10, 2026

Implemented locally; **not deployed and not yet approved for launching ads**. The original project was preserved. This updated copy is based on the October 11 Codex output: the live homepage matched except Cloudflare email obfuscation, and live `main.js` and `config.js` matched byte-for-byte before editing. Other live pages and hosting account settings were not exhaustively compared.

## What changed

- Added `privacy-policy/index.html`: 14 readable sections covering all requested topics, matching the existing design, with title/description/canonical metadata. Accessible without authentication. A visible draft notice remains until owner verification.
- Updated all eight existing HTML pages: footer Privacy Policy link, Advertising preferences button, and consent/config scripts. Updated homepage final-step privacy notice exactly as requested; added an accessible photo input label.
- Added `assets/js/advertising.js`: default-off Meta loader, accept/decline, preferences reopening, 180-day browser storage, storage-failure handling, withdrawal and cross-tab updates. Withdrawal removes unsent queued events and attempts to clear accessible first-party `_fbp`/`_fbc` cookies. Quote consent remains separate.
- Added `assets/js/pixel-config.js` and `scripts/build.mjs`: generate the public ID from `META_PIXEL_ID`; absent ID disables Meta. No credentials or invented production ID included.
- Updated `assets/js/main.js`: in-flight/completed guards prevent repeat submission handlers and rapid clicks; validates every step and reveals invalid fields; Lead runs only after Formspree returns a non-redirected successful response. Repeated Lead calls are deduplicated. Tracking exceptions cannot cause an accepted quote to appear failed. No quote data is passed to Meta.
- Existing GA4/Clarity IDs are empty. Their optional loader is no longer invoked; these services require separate appropriate disclosures/consent before future activation. Existing form endpoint remains unchanged.
- Added `assets/css/privacy.css`, tests, package scripts and build documentation. Updated sitemap and hosting cache rules for generated Pixel configuration. Existing images, core stylesheet, navigation, animations, and hosting redirects preserved.
- Asset script query versions avoid stale copies from the existing year-long immutable caching rule. Pixel configuration receives `no-store` in the supplied Cloudflare/Vercel header files.

## Verification performed

- 12 automated Node tests passed: no tracking by default/decline; single initialization/PageView; duplicate Lead prevention; withdrawal and queued-event removal; no historical Lead replay; invalid/missing ID; saved/expired/corrupt/unavailable storage; cross-tab withdrawal; invalid form; rapid/repeated submission; step navigation; HTTP/redirect/network failures; tracking failure after acceptance.
- `npm run lint` passed JavaScript syntax checks. There was no existing ESLint or other lint configuration.
- `npm run build` passed; dependency-free static output in `dist`. Production Pixel remains blank/disabled.
- All nine pages passed local asset/link/fragment checks, with zero broken internal references.
- Browser review at desktop 1280×720 and mobile 390×844: privacy page, direct route and refresh, footer link, consent decline persisting across refresh, preference reopening, and mobile controls. No horizontal overflow on the checked mobile policy view.
- Mobile five-step quote flow: missing selection blocked progression, required project area, optional photo step skipped, contact fields and final privacy notice displayed, accepted local response produced success.
- Desktop quote flow: simulated HTTP failure displayed the error and left retry available. Automated tests also covered network failure.
- No unexpected JavaScript console errors in inspected privacy/mobile-success views. The intentionally simulated failed endpoint returns an expected HTTP error.
- Browser success/failure tests used a localhost-only endpoint; **no real Formspree leads were sent**. Automated Pixel tests use a fixture ID and stub queue; no Meta account interaction occurred.

## Owner verification before publication

1. Confirm the privacy contact is monitored at `info@blindsfold.com` and who handles access/correction/withdrawal requests. Review the entire privacy draft.
2. Confirm actual retention and deletion practices for Formspree submissions, email, attachments, backups, customer/project records, and any legal retention duties. No fixed retention period has been invented.
3. Confirm who has access to customer information, actual safeguards, and any installers/contractors or other recipients. HTTPS is verified; no claims of encryption at rest, certifications, or detailed access controls were invented.
4. Confirm the full hosting/email provider list, storage regions, and any service integrations beyond the visible website code. Cloudflare is observed in live delivery; the actual origin hosting account is not verified. Source contains both Cloudflare-style and Vercel configuration.
5. In Formspree, verify endpoint `mppzbjbk` is active and routes notifications to **info@blindsfold.com**. A public contact email does not prove provider routing. Review spam/CAPTCHA/domain controls, notification rules, and that no workflow adds quote customers to unrelated marketing.
6. Confirm photo uploads are supported by the current Formspree plan and provider file-size/type limits. Existing `FormData` upload transport and JPEG/PNG/WebP chooser are preserved. Actual file acceptance and delivery were not verified.
7. Confirm any promotional communications practice and CASL records. A requested reply and a requested quote have different CASL exemptions; a requested quote may still require identification and unsubscribe information. No promotional checkbox or automatic subscription was added.
8. Confirm the actual Meta Pixel ID, intended advertising uses and account configuration. Disable automatic advanced matching, automatic event detection and any Event Setup Tool rules that could add extra Lead events or capture fields. Code does not enable Conversions API or advanced matching and disables automatic configuration before initialization.
9. After factual review, finalize policy wording, replace the preparation date with the effective/revision date, and remove the visible draft notice. Do not deploy the draft as a completed policy.

## Configure and deploy using the existing host

Set `META_PIXEL_ID` to the real numeric Pixel ID in the current host’s build environment. Use `npm run build` and publish `dist`. Keep every existing unrelated environment variable and integration unchanged. For manual static uploads, build locally with the environment variable and upload the contents of `dist`. The Pixel ID is public; never supply Meta access tokens or other secrets.

There is no existing framework or runtime environment substitution; the small Node build step bridges the hosting variable into a static public script. A blank variable is safe and leaves advertising tracking inactive. Source `config.js` and Formspree endpoint are not rewritten by the build. Verify the generated script and its cache headers after deploying.

No deployment was attempted because policy facts, live integration testing, Pixel configuration, and the existing host account are not yet verified. The package is an implementation/review deliverable, not a claim that advertising is ready to launch.

## Live checks remaining

After policy approval, test in the existing host’s preview/staging environment first, with the real Pixel and browser network inspection. Then verify the final live host:

1. In a clean browser, ensure no request to Meta before choice; decline, navigate and submit a controlled quote, and verify no PageView/Lead. Repeat on mobile.
2. Accept advertising: verify one PageView per page load and no duplicate initialization. A full navigation to another static page produces its own PageView; opening or navigating the quote form does not.
3. Use Meta Events Manager → the selected Pixel/dataset → Test Events → browser website testing. Follow the UI to open the preview/live URL and confirm PageView.
4. Make one clearly labelled, owner-coordinated test quote; verify one Lead only after successful Formspree acceptance and verify the notification is actually received at `info@blindsfold.com`. Check spam/quarantine and attachment delivery if supported. Do not create repeated unnecessary real leads.
5. Invalid submissions, failed requests, form opening, step changes and ordinary page visits must not produce Lead. Use controlled failure interception/staging for errors rather than repeatedly sending real leads. Inspect event payloads to confirm no quote fields or photo contents.
6. Test withdrawal before and after the library loads, subsequent navigation, refreshed choice, mobile devices and ad blockers. Prior transmitted data cannot be recalled by the website. Server acceptance does not guarantee email receipt or Meta delivery.
7. Test `/privacy-policy` directly and after refresh on the actual host, footer links, mobile layout, all page assets and console/network errors. Local directory hosting redirects to the trailing-slash equivalent; the production host’s handling remains to be verified.

**Email delivery, real photo delivery and Meta Events Manager verification are not completed.** Browser/backend mocks prove the UI paths only. Browser guards do not provide backend idempotency across reloads or an ambiguous connection loss after server acceptance; the existing provider would need to support server-side idempotency to guarantee that stronger property. No automatic retries were introduced.

## Research and applicability

Official sources checked November 10, 2026:

- [OPC: Summary of privacy laws in Canada](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/02_05_d_15/): PIPEDA generally applies to private commercial organizations in Manitoba.
- [OPC: Consent principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/): explain purposes and consequences; optional processing needs meaningful choices.
- [OPC: Online behavioural advertising](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/bg_ba_1206/): clear disclosure, withdrawal and limits on implied consent. This implementation follows the requested stricter prior opt-in approach.
- [Manitoba: FIPPA](https://www.gov.mb.ca/fippa/public/): public-sector law, not the general private-business privacy regime.
- [Manitoba: Privacy Act](https://web2.gov.mb.ca/laws/statutes/ccsm/p125.php?lang=en): civil protection against specified invasions of privacy.
- [Manitoba: legislative history of P33.7](https://web2.gov.mb.ca/laws/statutes/ccsm/_info1act.php?c=P33.7&en=2013%2C+c.+17): the Personal Information Protection and Identity Theft Prevention Act was repealed March 31, 2024 without ever coming into force. It is not treated as operative legislation.
- [CRTC: CASL information session](https://www.crtc.gc.ca/eng/com500/info.htm): distinguishes requested replies from requested quotes/estimates and applicable message requirements.
- [CRTC: CASL FAQs](https://crtc.gc.ca/eng/com500/faq500.htm): marketing consent and recordkeeping.
- [Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/): form processing and US/international infrastructure.
- [Formspree’s AJAX example](https://formspree.io/blog/formspree-ajax/): HTTP `response.ok` confirms its AJAX submission acceptance; implementation also rejects unexpected redirects.

Meta’s developer documentation could not be retrieved through the research tool. The standard queued Pixel integration is covered by local tests, but real SDK/account behavior must be confirmed through Test Events. No certification or legal compliance guarantee is made.
