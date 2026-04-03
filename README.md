# Fullstack IT Products eCommerce (Beginner-Friendly)

This project is a clean fullstack ecommerce example for IT-related products (PCs, keyboards, mice, accessories).

Root structure
- `backend/` Express + TypeScript + Prisma + JWT
- `frontend/` React + TailwindCSS

## Prerequisites
- Node.js

## Backend setup

1) Create env file

Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET`.

2) Install dependencies

```bash
cd backend
npm install
```

3) Migrate and seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4) Run the API

```bash
npm run dev
```

Backend runs on `http://localhost:4000` and exposes:
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`, `GET /api/products/:id`
- Admin: `POST/PATCH/DELETE /api/products`
- `GET /api/categories`
- Admin: `POST/PATCH/DELETE /api/categories`
- Auth: `GET /api/cart`, `POST /api/cart/items`, `PATCH/DELETE /api/cart/items/:itemId`
- Auth: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`
- Admin: `GET /api/orders/admin/all`, `PATCH /api/orders/admin/:id/status`

Seed users
- Admin: `admin@example.com` / `Admin123!`
- Client: `client@example.com` / `Client123!`

## Frontend setup

1) Create env file

Copy `frontend/.env.example` to `frontend/.env` if you want to override the API URL.

2) Install dependencies

```bash
cd frontend
npm install
```

3) Run the UI

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Reports
- Backend report: `backend/rapport.txt`
- Frontend report: `frontend/rapport.txt`

