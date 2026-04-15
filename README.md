# SIGNAL

Tap-based assessment and report. The Vite app lives in **`signal/`**. Vercel uses the **repository root** (`vercel.json` + `api/score.mjs`).

## Git

```bash
cd c:\SignalApp
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub already created an empty repo, use the URL it shows. If the remote already exists with the wrong URL: `git remote set-url origin <url>`.

`signal/.env` is **not** committed (see `signal/.env.example`). Set secrets in GitHub only if you use Actions; for Vercel, set env vars in the Vercel dashboard.

**Lead capture on the live site** uses **`/api/save-lead`** with the Supabase **service role** key (server-only). In Vercel, add **`SUPABASE_SERVICE_ROLE_KEY`** from Supabase → **Project Settings → API → service_role** (keep it secret; never `VITE_`). The app still uses **`VITE_SUPABASE_URL`** for that route (same project URL as the anon key).

## Local dev

```bash
cd signal
npm install
npm run dev
```

## Build

From repo root: `npm run build` (builds `signal/`).

Deploy details: **`SIGNAL_build_spec.md`** → section **Vercel deployment**.

## Supabase in Cursor (MCP)

This repo can use Supabase’s **Model Context Protocol** server so the agent can inspect tables, run SQL (with your approval), and align schema with the app—similar to wiring MCP in another project.

1. **Personal access token** (not the anon key): [Supabase Account → Access Tokens](https://supabase.com/dashboard/account/tokens) → create a token.
2. **Project ref**: the subdomain in `https://YOUR_REF.supabase.co` (also under **Project Settings → General**).
3. Copy the example config and fill in values:
   - Copy **`.cursor/mcp.json.example`** → **`.cursor/mcp.json`** (same folder).
   - Replace `YOUR_PROJECT_REF` and `YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN`.
   - The example uses **`--read-only`** so tools default to read-only; remove that flag only if you want the MCP server to apply schema/data changes (use with care on production).
4. **Restart Cursor**, then check **Settings → MCP** (or **Cursor Settings → Tools & MCP**) and confirm **`supabase-signal`** is connected.

**Git:** `.cursor/mcp.json` is **gitignored** so tokens are not committed; keep **`mcp.json.example`** in the repo as the template.

If **`npx`** fails to start the server on Windows, try changing **`command`** to **`cmd`** and **`args`** to `["/c", "npx", "-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_REF", "--read-only"]` with the same **`env`** block—see [Supabase MCP docs](https://supabase.com/docs/guides/getting-started/mcp).
