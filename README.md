# 🏪 Store Rating Platform

A full-stack web application that lets customers discover and rate stores, gives store owners insight into their performance, and gives administrators complete control over the platform.

---

## 🚀 Quick Start

### 1 — Backend

```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate deploy     # run DB migrations
npm run seed                  # create first admin + sample data
npm run dev                   # starts on http://localhost:3000
```

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

> Swagger UI is live at **http://localhost:3000/api/docs**

---

## 🔑 Default Login Credentials

After running `npm run seed` these accounts are ready:

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@storerate.com` | `Admin@12345` |
| **Store Owner** | `owner@bestgroceries.com` | `Owner@12345` |
| **Normal User** | `alice@example.com` | `User@12345` |
| **Normal User** | `bob@example.com` | `User@12345` |

> The seed is **safe to re-run** — it uses upsert so it never creates duplicates.

---

## ✨ What the Platform Does

### Three roles, one login system

**System Administrator**
- Dashboard with live stats (total users, stores, ratings) and charts
- Create users of any role — Normal User, Store Owner, or another Admin
- Create and manage stores, assign store owners
- Filter and sort all user/store listings by name, email, address, role
- View user detail — store owners show their average rating

**Normal User**
- Self-register through the public registration page
- Browse all stores with overall ratings and their own submitted rating
- Submit ratings (1–5 stars) for any store
- Edit their own submitted rating
- Update their password

**Store Owner**
- Login-only access (created by admin)
- Dashboard showing every store they own with:
  - Average rating and total count
  - Rating distribution chart (1★ → 5★)
  - Full list of users who submitted ratings with dates
- Update their password

---

## 🏗️ Project Structure

```
store_rating/
├── backend/                  Express + Prisma API
│   ├── app/
│   │   ├── admin/            Admin controller + routes
│   │   ├── common/
│   │   │   ├── middleware/   auth, RBAC, error handler, rate limiter
│   │   │   ├── service/      database, JWT, logger, swagger
│   │   │   ├── helper/       config loader
│   │   │   └── dio/          base DTO, response DTO
│   │   ├── user/             user.dto · service · controller · validation · routes
│   │   ├── store/            store.dto · service · controller · validation · routes
│   │   └── rating/           rating.dto · service · controller · validation · routes
│   ├── prisma/
│   │   ├── schema.prisma     DB schema
│   │   └── migrations/
│   ├── routes/               top-level router (re-exports app/routes.ts)
│   ├── seed.ts               bootstrap script
│   ├── server.ts             app entry point
│   └── swagger.json          OpenAPI 3.0 spec
│
└── frontend/                 React + Vite SPA
    └── src/
        ├── api/              axios singleton + per-resource API modules
        ├── store/            Redux slices — auth, toast, theme
        ├── hooks/            useAuth · useStores · useRating · useDebounce · etc.
        ├── components/
        │   ├── ui/           Button · Input · Table · Modal · Select · Pagination · StatCard · Skeleton
        │   └── shared/       ProtectedRoute · RoleGuard · StarRating · RatingModal · ToastContainer · etc.
        ├── layouts/          AppLayout (sidebar + topbar) · AuthLayout
        ├── pages/
        │   ├── auth/         Login · Register
        │   ├── admin/        AdminDashboard · AdminUsers · AdminStores
        │   ├── owner/        OwnerDashboard
        │   └── user/         Stores · Profile
        ├── types/            TypeScript interfaces matching backend DTOs
        └── utils/            validations (Zod) · roleLabel · apiError
```

---

## 🔧 Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Framework | **Express.js** v5 with TypeScript |
| Database | **PostgreSQL** (Neon hosted) |
| ORM | **Prisma** v7 with `@prisma/adapter-pg` |
| Auth | **JWT** (access + refresh tokens) via `jsonwebtoken` + `passport-jwt` |
| Validation | **express-validator** |
| Security | **Helmet** (HTTP headers) + **express-rate-limit** |
| Logging | **Winston** + Morgan stream adapter |
| API Docs | **Swagger UI** via `swagger-ui-express` |
| Dev | `ts-node-dev` + `tsconfig-paths` |

### Frontend

| Layer | Technology |
|---|---|
| Framework | **React 18** + TypeScript + **Vite** |
| Styling | **Tailwind CSS v4** + **CSS Modules** |
| State | **Redux Toolkit** (auth, toast, theme slices) |
| Routing | **React Router v6** |
| Forms | **React Hook Form** + **Zod** validation |
| HTTP | **Axios** (singleton with JWT interceptor + auto refresh) |
| Charts | **Recharts** |
| Components | **Headless UI** (custom Select/Dropdown) |
| Icons | Inline SVG |

---

## 🗄️ Database Schema

```
User  ──┐
        ├─ id, name, email, passwordHash, address, role, createdAt, updatedAt
        │  role ∈ { ADMIN, NORMAL_USER, STORE_OWNER }
        │
Store ──┤
        ├─ id, name, email, address, ownerId → User(id), createdAt, updatedAt
        │
Rating──┘
        ├─ id, value (1-5), userId → User(id), storeId → Store(id)
        └─ UNIQUE(userId, storeId)  — one rating per user per store
```

**Indexes:** `users(role)`, `users(name)`, `users(email)`, `stores(name)`, `stores(address)`

---

## 🔐 Security & Auth Flow

```
1. POST /api/users/login  →  { accessToken (30min), refreshToken (2d) }
2. All protected requests  →  Authorization: Bearer <accessToken>
3. On 401:  Axios interceptor automatically calls POST /api/users/refresh-token
4. On refresh success:  retry original request with new token
5. On refresh fail:  dispatch logout, redirect to /login
```

**RBAC middleware** enforces role at the route level:
```ts
router.get("/dashboard", authenticateJwt, authorize("ADMIN"), getDashboard);
router.post("/ratings",  authenticateJwt, authorize("NORMAL_USER"), createRating);
```

---

## 📋 Form Validation Rules

| Field | Rule |
|---|---|
| Name | Min 20 characters, Max 60 characters |
| Email | Standard email format |
| Password | 8–16 chars · at least 1 uppercase · at least 1 special character |
| Address | Max 400 characters, required |
| Rating | Integer 1–5 |

Validated on both frontend (Zod + React Hook Form) and backend (express-validator).

---

## 🌐 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Self-register as Normal User |
| POST | `/api/users/login` | Public | Login (all roles) |
| POST | `/api/users/refresh-token` | Public | Exchange refresh token |
| GET | `/api/users/me` | Any | Get own profile |
| PUT | `/api/users/me/password` | Any | Update own password |
| GET | `/api/users` | Admin | List users with filters + pagination |
| POST | `/api/users` | Admin | Create user (any role) |
| GET | `/api/users/:id` | Admin/Self | User detail (shows rating for Store Owner) |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/stores` | Public+OptAuth | List stores (includes `userRating` if authenticated) |
| GET | `/api/stores/:id` | Public+OptAuth | Store detail |
| POST | `/api/stores` | Admin | Create store |
| PUT | `/api/stores/:id` | Admin | Update store |
| DELETE | `/api/stores/:id` | Admin | Delete store |
| GET | `/api/stores/owner/dashboard` | Store Owner | Dashboard with raters list |
| POST | `/api/ratings` | Normal User | Submit rating |
| PUT | `/api/ratings/:id` | Normal User (own) | Edit own rating |
| DELETE | `/api/ratings/:id` | Normal User (own) / Admin | Delete rating |
| GET | `/api/ratings/user/me` | Any | Own submitted ratings |
| GET | `/api/ratings/store/:id` | Public | All ratings for a store |
| GET | `/api/admin/dashboard` | Admin | Stats + chart data |

> Full interactive docs: **http://localhost:3000/api/docs**

---

## 🎨 Frontend Features

- **Light / Dark theme** — toggled via Redux, persisted in `localStorage`, respects OS preference on first visit
- **Responsive** — mobile bottom-sheet modals, slide-in drawer navigation, stacked filter bars
- **Pagination** — all listing tables (stores, users) support server-side pagination (10 per page)
- **Lazy loading** — every page is a separate JS chunk via `React.lazy()` + `Suspense`
- **RBAC** — `ProtectedRoute` HOC + `RoleGuard` component + `authorize()` middleware
- **Auto token refresh** — Axios interceptor queues concurrent requests during refresh
- **Charts** — Recharts bar/pie/donut charts on admin and store owner dashboards
- **Custom dropdown** — Headless UI `Listbox` with loading state, dark mode, keyboard nav

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secret-key"
ACCESS_TOKEN_EXPIRY="30m"
REFRESH_TOKEN_EXPIRY="2d"
PORT=3000
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🧪 Re-seeding

If you want to reset all data to a clean state:

```bash
cd backend
npm run seed
```

This will:
- Recreate the 4 default accounts (admin, owner, 2 users)
- Recreate 2 sample stores with correct UUIDs
- Add sample ratings so dashboards show data immediately

---

## 📦 Available Scripts

### Backend

```bash
npm run dev      # dev server with hot reload
npm run build    # compile TypeScript
npm run seed     # seed database
```

### Frontend

```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # production build
npm run preview  # preview production build
```
