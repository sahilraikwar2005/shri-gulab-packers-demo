# Shri Gulab Packers & Movers — Public Website

This React/Vite app can be built and hosted as a static frontend without the
Express backend. The backend and the separate admin app are not part of this
static deployment.

## Run locally

```bash
npm install
npm run dev
```

The public website reads its settings, service list, fleet, testimonials, FAQs,
gallery, and locations from `src/data/backend-snapshot/`. These JSON files are
an exact copy of the corresponding public records in `backend/data/`. Update
the frontend snapshot when the backend's public content changes.

`src/data/contentRepository.js` is the data-access boundary used by the pages.
It serves the local snapshots by default and can use the existing API when API
mode is explicitly enabled.

## Build and deploy to GitHub Pages

```bash
npm run build
npm run preview
```

The repository workflow at `.github/workflows/deploy-pages.yml` builds this
frontend and deploys `frontend/dist` to GitHub Pages when `main` or `master` is
updated. Vite uses `/shri-gulab-packers-demo/` as the production base path, and
the workflow publishes an `404.html` fallback so React Router routes continue
to load when opened directly or refreshed.

After pushing the project to
`https://github.com/sahilraikwar2005/shri-gulab-packers-demo`, open **Settings
→ Pages**, select **GitHub Actions** as the build and deployment source, and
save. The workflow will publish the site at
`https://sahilraikwar2005.github.io/shri-gulab-packers-demo/`.

## Reconnect the backend later

Local JSON is the default. To use the existing API in a full-stack deployment,
set these public frontend build variables:

```text
VITE_DATA_SOURCE=api
VITE_API_URL=https://your-api-host.example
```

`VITE_API_URL` must be the public API origin and must not contain credentials or
private keys. Configure the backend's CORS policy for the deployed website.
Never put database credentials, signing keys, or other secrets in `VITE_*`
variables.

## Actions that require the backend

Quote submissions, contact form submissions, and quote photo uploads remain
visible but return an explicit unavailable message in local mode; they are not
stored or reported as successful. Enable API mode and configure the backend to
submit them. Authentication and admin operations belong to the separate
`admin/` app and are not included in this public static frontend.
