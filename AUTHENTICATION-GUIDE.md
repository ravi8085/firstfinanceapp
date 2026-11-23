# Set up Google sign-in and mobile OTP from scratch

The application code is ready for Supabase Auth. A hosted project has not been created: the Supabase dashboard currently requires you to sign in or create an account. Create the accounts under your ownership, then the integration can be connected without rebuilding the login screens.

## What each service does

| Service | Purpose | Where its credentials go |
| --- | --- | --- |
| Supabase | Creates customer accounts and manages verified sessions | Public project URL and publishable key go into the app |
| Google Auth Platform | Lets customers use their Google account | Google client ID and client secret go into Supabase |
| SMS provider | Delivers the mobile verification code | Provider credentials go into Supabase, not the app |

The website requests Google identity for sign-in, not access to customers’ Gmail messages. No custom database table is required just to authenticate customers. Supabase manages authentication users. This version does not store financial plans.

## 1. Create your Supabase project

1. Open [Supabase](https://supabase.com/dashboard/sign-up), create your account, and finish email verification if requested.
2. Create an organization if prompted. Review the displayed plan before accepting it.
3. Create a new project named **Chanakya Finance**. Choose a suitable available region near your customers. Set the database password yourself and keep it in your password manager.
4. Wait until the project is ready.
5. Use the project's **Connect** dialog or **Settings → API Keys** to obtain its project URL and **publishable key**. Never use its secret key or service-role key in this frontend.

The app uses these exact configuration names:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
VITE_ENABLE_DEMO=false
```

From the app folder, `npm run setup:auth` asks for the two public values and creates `.env.local`. It does not ask for the database password, Google secret, or SMS credentials. Restart the development server after configuration changes.

Reference: [Supabase React setup](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs).

## 2. Set your website addresses

In Supabase, open **Authentication → URL Configuration**.

- Set **Site URL** to the website address customers will use.
- Add the app's permitted return addresses to **Redirect URLs**.

For the current local preview, add:

```text
http://localhost:5180/
http://localhost:5180/calculator
```

The normal `npm run dev` command uses port 8080, so also add these when using that command:

```text
http://localhost:8080/
http://localhost:8080/calculator
```

For the original Lovable deployment, the corresponding addresses are:

```text
https://salary-guide-india.lovable.app/
https://salary-guide-india.lovable.app/calculator
```

Use those only when the updated code is deployed at that address. If deploying to Azure, use the actual Azure website address instead. Add exact return paths for any other page from which you allow sign-in. The app currently returns to the page's path and drops its query string.

## 3. Configure Google sign-in

1. Open [Google Cloud Console](https://console.cloud.google.com/) with the account that should own the app. Create a project named **Chanakya Finance**, or select your existing organization project.
2. Open **Google Auth Platform**. Complete the branding/audience setup with the app name, support email, and requested contact details. Choose an external audience for public customers. While testing, add the Google accounts you will use as test users.
3. Under **Data Access**, use only the identity scopes needed for login: `openid`, email, and profile.
4. Under **Clients**, create an OAuth client of type **Web application**.
5. Add the website origin under **Authorized JavaScript origins**, for example `http://localhost:5180` during development and the actual production origin when deployed. Origins contain no path.
6. In Supabase, open **Authentication → Sign In / Providers → Google**. Copy the callback URL displayed there into Google's **Authorized redirect URIs**. For the default hosted project, it has this shape:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

7. Copy Google's client ID and client secret into the Supabase Google provider settings. Enable the provider and save.
8. Return to this app and choose **Continue with Google**. Confirm that sign-in returns to the app and opens the planning experience.

Google's callback URL and the app's return URL serve different purposes. Copy the callback directly from Supabase; do not replace it with the Lovable or Azure homepage.

Before opening Google login to all customers, complete Google's production audience/branding requirements shown in your console. Reference: [Supabase Google provider setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-google).

## 4. Configure mobile OTP

Google sign-in can be configured independently of SMS delivery. For mobile OTP, select an SMS service supported by Supabase; options include Twilio, MessageBird, Vonage, and community-supported Textlocal. Compare the provider's Indian delivery support and charges before choosing it.

1. Create an account with your selected provider and complete its sender/business verification. Review its billing terms yourself before activating paid service.
2. In Supabase, open **Authentication → Sign In / Providers → Phone** and enable phone sign-in.
3. Choose the SMS provider and enter the credentials and sender/service settings requested for that provider. Keep these in Supabase.
4. Configure a six-digit OTP to match the app. Set expiry and server request limits appropriate for the rollout. The app prevents resends for 60 seconds, but provider-side limits are still necessary.
5. Confirm with the SMS provider which Indian sender/template registrations apply to your delivery route, and complete its required setup.
6. Test a real `+91` number. Check successful delivery, wrong code, expired code, resend, and sign-out.

For development, Supabase also supports explicitly configured test phone numbers with test codes. These do not prove real SMS delivery. Remove test credentials from a customer production project.

This version does not include a CAPTCHA widget. If you enable Supabase CAPTCHA enforcement, its widget and token must also be connected to the login form before requests will succeed.

Reference: [Supabase phone login and SMS providers](https://supabase.com/docs/guides/auth/phone-login).

## 5. Connect the deployed app

For the existing Azure workflow, add the two public values as GitHub repository **Settings → Secrets and variables → Actions → Variables**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

The workflow already reads these variables and sets `VITE_ENABLE_DEMO=false`. Preserve the existing `AZURE_STATIC_WEB_APPS_API_TOKEN` secret. Rebuild/deploy after changing the public configuration because Vite includes it at build time.

If continuing with Lovable, configure the same values in that project's build environment and publish the integrated source there. A local `.env.local` is not automatically available to a remote builder.

## Verify the result

- A new browser session shows the sign-in screen before any planning pages.
- Successful Google or SMS verification opens the app.
- Invalid or expired codes leave the customer on sign-in.
- Refresh restores a valid authenticated session.
- Sign-out returns to sign-in and clears financial form details from memory.
- A production build has no demo bypass.

## Common problems

| What you see | What to check |
| --- | --- |
| “Sign-in is not available yet” | Public URL/key are missing; run setup and restart or rebuild |
| Google `redirect_uri_mismatch` | Google's authorized redirect must match the Supabase callback exactly |
| Google allows only some accounts | Check testing audience and test users in Google Auth Platform |
| SMS never arrives | Provider credentials, balance, destination permissions, sender registration, and delivery logs |
| Sign-in returns to the wrong website | Supabase Site URL and allowed return addresses |
| Requests fail after enabling CAPTCHA | A CAPTCHA widget/token is not connected in this version |

When your Supabase account is ready, the next concrete step is to create **Chanakya Finance** in that account. You can share its public project URL and publishable key for connection; keep account passwords and private provider credentials in their respective dashboards.
