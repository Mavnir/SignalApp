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

## Local dev

```bash
cd signal
npm install
npm run dev
```

## Build

From repo root: `npm run build` (builds `signal/`).

Deploy details: **`SIGNAL_build_spec.md`** → section **Vercel deployment**.
