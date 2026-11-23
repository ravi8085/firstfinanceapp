# Integrated Chanakya redesign

For account creation and provider setup from scratch, start with [AUTHENTICATION-GUIDE.md](AUTHENTICATION-GUIDE.md). The optional `npm run setup:auth` command writes your public connection settings to `.env.local`.

The original React/Vite application now starts with sign-in and leads into an overview with voice and form entry. Existing learning, city expense, mutual fund, goal, retirement, and inflation tools remain accessible after sign-in.

## Run locally

1. Install Node.js and run `npm ci` in this directory.
2. Copy `.env.example` to `.env.local` and fill in your public Supabase URL and publishable key when available.
3. Run `npm run dev`.

Development includes an explicitly labelled interactive demo. Customer production builds require a real authenticated session: `VITE_ENABLE_DEMO` defaults to false and Azure CI sets it to false. Do not enable this bypass on a customer deployment.

## Connect sign-in

This archive did not contain an authentication provider configuration. The integration uses Supabase Auth, with no hard-coded OTPs or simulated Google sessions.

1. Create or select your Supabase project and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These are public browser configuration, not administrative credentials.
2. Enable Google in Supabase Auth. Create Google's OAuth client and register the Supabase callback URL shown in the provider settings. Store Google's client secret in Supabase, never in this frontend.
3. Allow the exact application origins and return paths in Supabase redirect settings, including localhost during development. The app returns to the current page after Google sign-in.
4. Enable phone authentication, connect an SMS provider in Supabase, and set a six-digit SMS OTP. Configure SMS delivery, rate limits, abuse protection, and the provider's applicable Indian messaging registration before customer launch. The UI includes a 60-second resend delay; server limits must also be enforced by the provider.
5. Test with a real account: successful Google sign-in, cancellation, valid and invalid SMS codes, expiry, resend, session restoration, and sign-out. Live Google and SMS delivery have not been tested without a configured project.

Official configuration guides:
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://supabase.com/docs/guides/auth/phone-login

## Deploy to the original Azure setup

The existing GitHub Actions workflow is retained. Set these GitHub repository variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Retain the `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret. Push the updated source to the connected repository to run the Azure workflow. A `public/staticwebapp.config.json` now handles direct links to client-side routes.

No GitHub repository URL, Azure deployment credentials, or live authentication configuration was supplied with the archive. The original live Lovable/Azure website has not been changed by this local integration.

## Voice input and planning

After an explicit successful sign-in, the app opens voice entry, greets the customer using their device's local time and Google profile name or optionally entered mobile sign-in name, then attempts recording after the spoken greeting. Permission and autoplay restrictions may require the customer to tap Start recording. Ordinary session refreshes do not trigger a new recording. A four-second silence timer uses browser speech start/end events; recognition can also end earlier if the browser's speech service ends its session. Manual stop, switching input modes, leaving the page, and hiding the tab stop the voice flow. This behavior has automated coverage using mocked speech events; live microphone behavior remains browser/device dependent.

- Browser speech recognition is opt-in and stops on mode change or leaving the page. Audio processing is handled by the browser speech service; no recording is uploaded by this app to its own server.
- The transcript remains editable. Captured amounts are highlighted and users explicitly review all details before generating the plan.
- English amount words, decimal lakh units, numeric amounts, and selected Hindi labels with Devanagari digits are supported. Hindi and Telugu recognition can be selected, but full regional-language intent and number-word parsing are not implemented. Missing or ambiguous values should be entered manually.
- Form and voice share state; switching retains entries. Financial inputs are held in memory, not saved to the account or browser storage. Refreshing or signing out clears them; moving between pages within the signed-in app preserves calculator inputs in memory.
- City prefill uses the archive's illustrative single-professional estimates. It explicitly replaces listed fields and requires household adjustment.
- Allocation illustrations preserve the original age/experience heuristic but are capped at available monthly surplus. They are educational, not a suitability assessment. Existing investment catalogue rates, forecasts, and fund data still need source/freshness review before customer launch.

## Checks

### Term-insurance comparison

In Illustration, choose Term Insurance to open the dedicated `/term-insurance` page. The same page is available in the main navigation. It carries over age, salary, family spending, dependants, and premium budget. A Back to my money plan link restores the calculator inputs and current step. Direct visits allow manual customer profile entry. Calculator state is held in React memory during the signed-in session, not in URL parameters or browser storage. Seven sourced insurer plans are available with official source/quote links. The catalogue is explicitly not exhaustive and is reviewed as of 23 November 2026. Known published outer age/cover/duration limits are shown without underwriting or approval decisions; unknown variant rules remain marked for confirmation.

Customers can add requested cover, end age, gross income, tobacco status, quote gender category, occupation, residency, payment term, payout preference, and optional benefits. Detailed medical records are not collected. Profile information remains local and is not appended to insurer links. A simple family-needs scenario supports spending, support years, debt balances, future obligations, reserved assets, and existing cover; its limitations are shown. The initial cover scenario is a rounded 15× take-home income heuristic, not an underwriting limit or recommendation.

No insurer/aggregator pricing API is connected. The panel does not invent personalised premiums or rank policies by unverified suitability. Customers can enter their insurer-quoted annual premiums for a side-by-side monthly-equivalent comparison with the illustration budget. Changing the quote profile clears previously entered quotes. For live prices or comprehensive market availability, connect an authorised provider's API, refresh product/variant data, and implement the provider's consent and quote requirements.

### Retirement contribution detail

The retirement tab now calculates and prominently displays the required monthly investment, the explicitly entered retirement contribution, and the additional monthly amount needed. It compares the requirement with the customer's available surplus. It does not assume that the general illustration budget (which includes insurance premiums and other goals) is a retirement investment. The target uses entered living expenses, an editable retirement age and duration, an existing retirement corpus, and editable inflation/return assumptions. The projection uses equal end-of-month contributions and beginning-of-year retirement withdrawals with continuing expense inflation. At or beyond the selected retirement age, it displays a lump-sum gap rather than a misleading zero monthly requirement. The older automatic age-based risk label and 7% withdrawal-income claim were removed.

Run `npm test`, `npx tsc --noEmit -p tsconfig.app.json`, and `npm run build`.

Automated coverage includes the sign-in gate, OTP destination and error handling, resend delay, spoken amount capture, all expense categories, emergency savings calculations, and surplus caps. Browser checks covered voice transcript extraction, switching to form, review, results, and sign-out. Live microphone transcription and live authentication require testing on supported customer devices and a configured provider.

Compatible dependency patches were applied. The original dependency stack still reports audit findings requiring broader upgrades, including development test tooling and the existing router/Zod packages. These upgrades have not been forced as part of the redesign.
