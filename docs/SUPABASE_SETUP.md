# Connect GearEx to Supabase — beginner's step-by-step guide

**Status:** GearEx has an optional account frontend, database policies, private avatar bucket, progress synchronization, and a server-side account deletion function in this development branch. **They are not active until you create and configure your own Supabase project.** Guest lessons, code editor, compiler, quizzes, certificates and local progress work without Supabase. Do not change domains during these steps.

> **Never share or commit:** the database password, the Supabase **secret/service_role** key, Google OAuth Client Secret, or your Supabase access token. The **project URL** and **publishable** key are designed to be present in a public frontend, but only with Row Level Security configured.

## 1. Create your first Supabase project

1. Open [Supabase](https://supabase.com/dashboard) and create a free account (or sign in).
2. Click **New project**, choose an organization, set **Project name: GearEx**, select a region convenient for your expected learners, and set a strong **database password**. Save it privately; it does not belong in GearEx files.
3. Let Supabase create the project. You should now see the project dashboard.
4. Record your **project reference ID** from **Project Settings → General**. This identifier is not a password.
5. Check the current pricing/limits before inviting public users. Supabase hosted services and email sending have quotas; no free plan guarantees infinite usage.

## 2. Create your protected database and private photo storage

1. In GitHub open **supabase/schema.sql** from the GearEx development branch.
2. Copy the **entire SQL file**.
3. In your Supabase dashboard open **SQL Editor → New query**.
4. Paste the SQL and select **Run**. Run it only once in a new project. The migration creates:
   - **gearex_progress**: one JSON learning snapshot per authenticated user.
   - **gearex_profiles**: private display name and optional avatar file path.
   - **gearex-avatars**: a **private** Storage bucket permitting only small WebP profile images.
   - Row Level Security (RLS) policies that let each signed-in user select, insert, update or delete **only their own** rows and avatar.
5. In **Database → Tables**, check that the two GearEx tables exist and **RLS is enabled**.
6. In **Storage**, check the avatar bucket exists and is **Private**. Do **not** switch it to Public.
7. If SQL reports a policy already exists, it may have been run already. Do not blindly delete policies; inspect them in Supabase before making changes.

**Why this matters:** the frontend's publishable key is visible to every visitor. RLS—not secrecy of the public key—is what protects each person's progress.

## 3. Configure website sign-in URLs

1. In Supabase open **Authentication → URL Configuration**.
2. Set **Site URL** to:
   \`https://nittinchughani.github.io/gearex/\`
3. Add this exact URL to **Redirect URLs**:
   \`https://nittinchughani.github.io/gearex/\`
4. For local development, also add \`http://localhost:8000/\` and \`http://127.0.0.1:8000/\` if needed. These are testing addresses, not public GearEx domains.
5. Save.

GearEx uses a browser-based PKCE auth flow. After successful Google or email login, Supabase redirects back to the URL above. Revisit these settings when a **real custom domain** is selected later; that is **not** part of this build.

Official docs: https://supabase.com/docs/guides/auth/redirect-urls

## 4. Enable passwordless email sign-in

1. Go to **Authentication → Sign In / Providers → Email** (exact navigation labels may vary).
2. Enable the Email provider and email-based sign-in.
3. GearEx calls \`signInWithOtp\`: with the default magic-link template, users receive a **sign-in link**, not a password-reset flow.
4. Test with your own email address first. Check spam/junk if delivery is delayed.
5. Before inviting many real users, review Supabase's hosted email delivery limits and configure a production email sender/SMTP service where necessary. A default development email service is not a dependable mass-mail service.

Official docs: https://supabase.com/docs/guides/auth/auth-email-passwordless

## 5. Set up "Continue with Google"

This step needs both **Google Cloud** and Supabase. Do not copy your Google Client Secret into GitHub.

1. Open https://console.cloud.google.com/ and create/select a Google Cloud project for GearEx.
2. Go to **Google Auth Platform → Branding** and set up the OAuth consent screen for GearEx. Choose the appropriate audience and fill required app/contact information.
3. Go to **Clients → Create client → Web application**.
4. Under **Authorized JavaScript origins**, enter:
   \`https://nittinchughani.github.io\`
5. Under **Authorized redirect URIs**, enter your Supabase callback URL, usually:
   \`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback\`
   Copy the **exact callback address shown inside Supabase's Google provider settings** instead of guessing it.
6. In Google Cloud, create the OAuth client. Copy the **Client ID** and **Client Secret** into **Supabase → Authentication → Sign In / Providers → Google**, then enable Google.
7. Save the Google provider. If the consent screen is in testing mode, add permitted test accounts, then complete Google's relevant review/publication steps before a broader release.

Important: Google's callback goes to **Supabase**, not directly to \`/gearex/\`. Supabase then redirects your user back to the allowed GearEx site URL.

Official docs: https://supabase.com/docs/guides/auth/social-sign-in/auth-google

## 6. Connect the public configuration to GearEx

1. Open **Supabase → Project Settings → API Keys / Data API**. Look for:
   - **Project URL**, such as \`https://YOUR_PROJECT_REF.supabase.co\`.
   - **Publishable key**, often beginning with \`sb_publishable_\`. A legacy public anon key can also work.
2. In the GearEx GitHub development branch, open **assets/supabase-config.js**.
3. Replace the **two empty strings only**:

   \`\`\`js
   window.GearExSupabaseConfig=Object.freeze({
     url:'https://YOUR_PROJECT_REF.supabase.co',
     publishableKey:'sb_publishable_YOUR_PUBLIC_KEY'
   });
   \`\`\`

4. **Never** paste a key beginning with \`sb_secret_\`, the \`service_role\` key, or the database password into frontend JavaScript.
5. Commit your changes to the development branch. When both public values are set, the account UI will connect automatically. Until then, GearEx stays in guest mode.

Only the URL and public publishable key are necessary to connect the **browser**. The service-role key never belongs in the browser.

Official docs: https://supabase.com/docs/guides/api/api-keys

## 7. Enable secure "Delete account"

GearEx includes \`supabase/functions/delete-account/index.ts\`, a server-side function that independently verifies the caller's Supabase session, deletes their private avatar, then deletes their Auth account. The related database records cascade-delete. The admin key is read **only on Supabase's server**.

On your computer:

1. Install Node.js if not installed. Clone your own GearEx repo and open its root directory in Terminal / Windows PowerShell.
2. Use the **Supabase CLI** through npx:

   \`\`\`bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   \`\`\`

3. The repository includes \`supabase/config.toml\` with function JWT gateway verification turned off **only because the function itself validates the caller against Supabase Auth**. Do not remove that verification from the function.
4. Restrict permitted browser origins:

   \`\`\`bash
   npx supabase secrets set GEAREX_ALLOWED_ORIGINS="https://nittinchughani.github.io,http://localhost:8000,http://127.0.0.1:8000"
   \`\`\`

5. Deploy the deletion function:

   \`\`\`bash
   npx supabase functions deploy delete-account --no-verify-jwt
   \`\`\`

6. Check **Supabase → Edge Functions** for a healthy \`delete-account\` deployment. Hosted Supabase functions typically provide \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\`, and \`SUPABASE_SERVICE_ROLE_KEY\` to the server environment automatically. Keep them server-only.
7. Test deletion with a **throwaway test account**, not your main account. Confirm the account's progress, profile and avatar are removed. Sign-in with that account should not restore deleted data.

Why \`--no-verify-jwt\`? The public Edge Function gateway may reject the newer publishable/JWT combination; **the function still performs a server-side \`auth.getUser(token)\` check before taking any action**. Never change it to accept an arbitrary user ID from the request.

Official docs: https://supabase.com/docs/guides/functions

## 8. Test two accounts, a guest, and actual cloud saves

Before treating the account system as ready, test every scenario:

- **Guest:** open GearEx without signing in. Complete a lesson, save a code snippet, upload a local photo and refresh. Progress and photo stay on that device.
- **First sign-in:** complete progress as a guest, sign in, and confirm the **merge guest progress** prompt. Check lessons, scores, certificate and saved code.
- **Decline import:** on a separate test browser profile, choose **Cancel**. Cloud account progress should stay separate; guest data should return after sign-out.
- **Cloud sync:** sign into the **same account** in another browser profile and verify its completed lessons, saved drafts, quiz results and certificates.
- **Isolation:** create a **different account** and ensure it cannot read the first account's records or profile picture.
- **Profile image:** upload JPG/PNG/WebP, reload, confirm the avatar, then remove it. The original image is cropped and re-encoded as WebP to discard embedded metadata.
- **Offline:** edit and save progress while the network is down. The UI must indicate that a cloud save has not completed; reconnect and confirm synchronization.
- **Account deletion:** test using a disposable account; confirm the private data and account are gone.

The repository's automated unit tests and local browser tests cannot prove real Supabase auth or RLS behavior. Those require your configured project. Do **not** interpret green mocked tests as production verification.

## 9. Troubleshooting

| Symptom | What to check |
|---|---|
| "Cloud sign-in setup pending" | The two public config values are still blank or invalid |
| Google "redirect_uri_mismatch" | Exact Google Authorized redirect URI must match Supabase provider callback |
| Supabase login returns to the wrong page | Check Site URL and exact Redirect URLs |
| "permission denied" / RLS errors | Run the schema, enable RLS, and confirm authenticated session |
| Email link never arrives | Email provider enabled, sender limits, spam folder and email templates |
| Photo won't upload | The private bucket/policies exist, file is a supported image under 4 MB, browser can encode WebP |
| "Delete account" unavailable | Deploy the Edge Function, verify server secrets and allowed origins |
| Guest work doesn't sync | Sign in, explicitly choose import, and verify the cloud save confirmation |

## 10. Privacy and public-release checks

Before opening GearEx broadly to learners, review its privacy copy, terms, support contact, email sender configuration, data retention/deletion, database quotas, and legal requirements for any younger audience. Accounts should remain **optional**, and profile images are **private by default**.

**Do not launch a new domain yet.** First connect the project, verify end-to-end authentication, and complete the remaining product checks. When it is time for the permanent domain, update Supabase Redirect URLs, Google Authorized JavaScript origins and the deletion-function allowed origins.
