# Shri Gulab Packers & Movers — Full Stack

Three independent apps:

- `backend/` — Express + MongoDB REST API
- `frontend/` — Public React (Vite) website
- `admin/` — Admin React (Vite) dashboard

## Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- (Optional) Cloudinary account for image uploads
- (Optional) SMTP for email notifications

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env: MONGODB_URI, JWT_SECRET, CORS_ORIGINS, etc.
npm install
npm run seed:admin   # creates superadmin (admin@moveeasy.com / Admin@12345)
npm run seed:data     # loads branding, contact details, services
npm run dev           # http://localhost:5000
```

### 2. Frontend (public site)
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm install
npm run dev           # http://localhost:5173
```

### 3. Admin
```bash
cd admin
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm install
npm run dev           # http://localhost:5174 (adjust port if needed)
```

## Default admin credentials
- Email: admin@moveeasy.com
- Password: Admin@12345
Change immediately in production.

## API
Base: `/api/v1`. All admin writes are protected by HttpOnly cookie auth and role/permission checks.
Key endpoints: settings, services, locations, fleet, faqs, gallery, testimonials, seo, inquiries, quotations, bookings, users, reviews, upload, reports, activity-logs.

## Cloudinary / Images
Set `CLOUDINARY_*` to enable uploads (admin upload + public quote photos).

## Google Reviews
Set `GOOGLE_PLACES_API_KEY` and configure Place ID in admin → Google Reviews, then Fetch.

## Development storage (JSON, no MongoDB)
Backend defaults to JSON storage (`STORAGE_DRIVER=json`) in `backend/data/`. MongoDB is not required for local development. Run `npm run seed:data` after `npm run seed:admin`.

## MongoDB migration plan (later)
1. Set `STORAGE_DRIVER=mongo` and `MONGODB_URI`.
2. Implement a Mongo adapter implementing the same repository functions in `src/storage/mongoDb.js`.
3. Use a migration script to import existing JSON files into MongoDB collections.
4. Run both adapters in parallel during validation, then remove JSON adapter.

## Deployment
Each folder is independently deployable. Build frontends with `npm run build` and serve `dist/`. Backend as Node service behind reverse proxy. Set production CORS origins and secure cookies.

## Testing
Backend: `npm test` (Jest + Supertest, uses temporary JSON data).
Public/admin builds: `npm run build` in each folder.

## Logo asset
Place the client logo at `frontend/public/logo.png`. The navbar first uses `settings.logo` from Admin → Company Settings, then falls back to `/logo.png`, then to the company name.

## Notes on design referenceThe uploaded screenshot could not be processed by this model (no image input support). The UI implements a professional navy/orange movers design following the prompt's specified palette, typography, cards, shadows and section composition. You can further tweak Tailwind theme and component markup to match your exact screenshot.