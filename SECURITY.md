# Security

Notes on the security posture of the loachm site and the settings that must be
maintained in the Supabase dashboard.

## What protects the data

- **Row Level Security (RLS)** is the real access control. The Supabase anon key
  is public by design (it ships in the browser bundle); it grants nothing on its
  own — every table's RLS policies decide what an anon vs. authenticated caller
  can do. See `supabase/schema.sql`.
  - `deals`, `site_content`: public **read**, authenticated **write**.
  - `repairs`: **authenticated only** for every operation (holds customer PII).
- **Admin auth** is Supabase Auth (email + password). The `/admin` route guard is
  only UX — the data is protected server-side by RLS regardless of the UI.

## Required Supabase dashboard settings (must stay this way)

1. **Disable public sign-ups** — Authentication → Providers → Email →
   turn **OFF** "Enable Sign Ups" (or set the project to invite-only).
   *Why it's critical:* the repairs/site/deals write policies trust the
   `authenticated` role. If anyone can self-register, they become `authenticated`
   and could read customer PII and edit the site. With sign-ups off, only the
   admin account you created can authenticate.
2. **Storage bucket `product-images`** — keep it restricted:
   - Allowed MIME types: `image/png, image/jpeg, image/webp, image/gif`
   - Max file size: ~5 MB
3. **Enable MFA** for the admin account (Authentication → MFA) — recommended.
4. Never expose the **service_role** key in client code or the repo. Only the
   anon key belongs in the frontend.

## Frontend hardening (in this repo)

- **HTTP security headers** via `vercel.json`: Content-Security-Policy, HSTS,
  X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy,
  Permissions-Policy.
- No `dangerouslySetInnerHTML` / `eval` / `innerHTML`; React escapes all
  user-supplied content (deal names, repair notes, etc.).
- Dependencies kept patched (`npm audit`).
- `robots.txt` disallows `/admin`.

## Known follow-up

- `index.html` still loads the **Tailwind Play CDN** (`cdn.tailwindcss.com`),
  which forces `script-src 'unsafe-eval'` in the CSP. Migrating Tailwind to a
  build step (PostCSS/Vite) would let us drop `unsafe-eval` and remove a
  third-party script dependency (also a performance win). Requires visual QA.
