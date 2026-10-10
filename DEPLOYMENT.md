# Deployment Guide

This guide prepares Job Application Tracker for a typical split deployment: a Python web service for Flask, a static frontend host for React/Vite, and a managed MySQL database.

## Before deploying

- Confirm the application works locally and the latest GitHub Actions run is green.
- Choose a managed MySQL provider that supports remote connections from your backend host. The app currently uses MySQL; a PostgreSQL-only database will not work without changing the database driver and code.
- Back up your local database before any production data import. Do not import test records.
- Keep all secrets in the hosting provider's environment-variable settings, not in Git.

## 1. Deploy the Flask API

Create a Python web service from this repository on a Linux-compatible host (for example, Render).

- **Root directory:** `backend`
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `gunicorn app:app`
- **Health-check path:** `/api/health`

Set these environment variables in the backend service:

| Variable | Value |
|---|---|
| `DB_HOST` | Hostname supplied by your managed MySQL provider |
| `DB_PORT` | Provider's MySQL port, usually `3306` |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Production database name |
| `JWT_SECRET_KEY` | A unique secret generated with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `CORS_ORIGINS` | Exact deployed frontend origin, e.g. `https://your-app.example` |
| `FLASK_DEBUG` | `false` |

Use the database provider's required TLS settings and network allowlist. Do not expose the MySQL server to the entire internet if the provider offers narrower access controls.

The app currently calls `db.create_all()` at startup. This creates missing tables but is not a schema-migration system. If you already have data, deploy against a fresh production database first or take a verified backup before connecting an existing database.

## 2. Deploy the React frontend

Create a static-site project from the same repository on a host such as Vercel or Netlify.

- **Project/root directory:** `frontend`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Set the frontend build environment variable:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN/api
```

Replace the example with the actual backend URL, then redeploy the frontend. Vite embeds `VITE_*` variables at build time, so changing the value requires a new build/deployment.

## 3. Connect and verify

1. Set backend `CORS_ORIGINS` to the exact frontend origin (scheme and hostname; no trailing slash).
2. Redeploy the backend after changing environment variables.
3. Open `/api/health` on the deployed backend and confirm it returns a successful status.
4. Register a new test account and verify login, create/edit/delete, search, filters, pagination, and analytics.
5. Verify one user's applications are never visible to another account.
6. Check hosting logs for errors, and confirm no credentials or tokens are exposed in logs or source control.

## Important limitations

- No hosting provider, production database, domain, or production secrets are configured by this guide.
- Do not use local development credentials or the example JWT placeholder in production.
- Do not upload or import personal job-application data until the production database, access controls, backups, and privacy settings are verified.
