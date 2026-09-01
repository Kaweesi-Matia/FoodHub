# FoodHub — MERN Food Delivery App.

A full-stack food delivery web application built with **MongoDB, Express, React, and Node.js**. Customers can browse restaurants, order food, and track deliveries; restaurant owners can manage menus and fulfill orders; admins can approve and moderate restaurants.

## Features

**Customers**
- Browse and search restaurants by name or cuisine
- View menus, add items to a persistent cart, and check out
- Place orders with delivery address and payment method selection
- Track order status in real time (pending → confirmed → preparing → out for delivery → delivered)
- Cancel orders while still pending, and leave star ratings + reviews after delivery
- Manage profile and saved delivery addresses

**Restaurant owners**
- Create and manage one or more restaurants
- Add, edit, and remove menu items by category
- View incoming orders and advance their status
- Open/close the restaurant for new orders

**Admins**
- Approve new restaurants before they go public
- Manage user roles and account status

**Engineering**
- JWT authentication delivered via an httpOnly cookie (not localStorage) to reduce XSS exposure
- Role-based access control (`customer`, `restaurantOwner`, `admin`) enforced in middleware
- Server-side price recalculation on checkout — the client never dictates the total
- Centralized error handling, input validation, rate limiting, and security headers (Helmet, mongo-sanitize)
- Clean separation of concerns: models / controllers / routes / middleware on the backend; pages / components / context / api on the frontend

## Tech stack

| Layer      | Technology                                             |
|------------|---------------------------------------------------------|
| Frontend   | React 18 (Vite), React Router, Tailwind CSS, Axios      |
| Backend    | Node.js, Express                                        |
| Database   | MongoDB with Mongoose                                    |
| Auth       | JWT in httpOnly cookies, bcrypt password hashing         |

## Project structure

```
food-delivery-mern/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token generation, DB seeder
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios service functions per resource
        ├── components/   # Reusable UI building blocks
        ├── context/      # Auth and Cart global state
        ├── pages/         # Route-level views
        ├── App.jsx
        └── main.jsx
```

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy the example env files and fill in your own values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/food-delivery
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

### 3. (Optional) Seed demo data

```bash
cd backend
npm run seed
```

This creates three demo accounts (all password `password123`):
- `admin@example.com` — admin
- `owner@example.com` — restaurant owner, with a sample restaurant + menu
- `jane@example.com` — customer

### 4. Run the app

In two terminals:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend on port 5000.

### 5. Production build

```bash
cd frontend && npm run build
```

With `NODE_ENV=production`, `backend/server.js` serves the built frontend from `frontend/dist` directly, so a single Node process can serve the whole app.

## API overview

| Method | Endpoint                              | Description                          | Access             |
|--------|----------------------------------------|---------------------------------------|---------------------|
| POST   | /api/auth/register                    | Create an account                     | Public              |
| POST   | /api/auth/login                       | Log in                                | Public              |
| GET    | /api/restaurants                      | List/search restaurants               | Public              |
| GET    | /api/restaurants/:id/menu             | Get a restaurant's menu               | Public              |
| POST   | /api/restaurants                      | Create a restaurant                   | Restaurant owner    |
| POST   | /api/menu                             | Add a menu item                       | Restaurant owner    |
| POST   | /api/orders                           | Place an order                        | Customer            |
| GET    | /api/orders/mine                      | List my orders                        | Customer            |
| PUT    | /api/orders/:id/status                | Advance order status                  | Restaurant owner    |
| POST   | /api/reviews                          | Review a delivered order              | Customer            |

## Deployment notes

This repo is a split deploy: **Render** for the API, **Vercel** for the React app. Restaurant pages, login, and orders fail in the browser if the env vars and Vercel rewrites below are missing.

### Render (backend)

Root directory: `backend`. Start command: `npm start`.

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random secret |
| `JWT_EXPIRES_IN` | `30d` |
| `CLIENT_URL` | `https://your-app.vercel.app` (production URL, no trailing slash; comma-separate extra origins) |

Seed Atlas once after the first deploy (`npm run seed` from the backend with `MONGO_URI` pointing at Atlas), otherwise the public restaurant list is empty.

### Vercel (frontend)

Set **Root Directory** to `frontend`, or deploy from the repo root (the root `vercel.json` already points at `frontend/dist`).

`vercel.json` rewrites `/api/*` to the Render API and sends SPA routes like `/restaurants/:id` to `index.html`. Without that rewrite, opening a restaurant link directly (or refreshing it) returns a Vercel 404 and looks like “data didn’t load”.

Optional build-time env:

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://foodhub-4etq.onrender.com/api` |

If `VITE_API_URL` is unset or still points at `localhost`, production builds call same-origin `/api`, which Vercel proxies to Render.

Use the **Production** domain from the Vercel dashboard, not a preview URL (`…-hash-….vercel.app`). Preview deployments are often login-gated and the URL changes every deploy.

In Vercel: **Settings → Deployment Protection** → turn off protection for Production so the site is public.

## License

MIT — free to use .

## Deployment links
**Backend**: [https://foodhub-4etq.onrender.com/](https://foodhub-4etq.onrender.com/)
**Frontend**: [https://food-gbmb16rpl-kaweesimatias-projects.vercel.app/](https://food-gbmb16rpl-kaweesimatias-projects.vercel.app/)
