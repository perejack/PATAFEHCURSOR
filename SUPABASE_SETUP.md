## Supabase Setup

1. Create `.env` from `.env.example` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Run `supabase-schema.sql` in your Supabase SQL editor.

## M-Pesa STK (HashBack)

Payments use the **same HashBack STK flow as FrankSurvey** (`initiatestk` → poll `transactionstatus`).

- **Dev:** `vite.config.ts` proxies `/api/hashback/*` → `https://api.hashback.co.ke/*` (avoids CORS).
- **Production (e.g. Vercel):** `vercel.json` rewrites `/api/hashback/(.*)` to HashBack’s API. For other hosts, add an equivalent rewrite/proxy.

Credentials:

- Optional env vars: `VITE_HASHBACK_API_KEY`, `VITE_HASHBACK_ACCOUNT_ID` (see `.env.example`).
- If unset, the app falls back to the same defaults used in the FrankSurvey project (override in production via `.env`).

### Important

- HashBack keys are sent from the browser (same model as FrankSurvey). Prefer env vars per environment.
- Do not expose Supabase **service-role** keys in frontend code.
