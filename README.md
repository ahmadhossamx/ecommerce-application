# Ecommerce Application — MERN Stack

A complete, working MERN ecommerce scaffold: MongoDB + Express + React (Vite) + Node, with Docker and CI/CD. No paid services, no secrets, no live deployment.

## Features
- Product catalogue with search and category filter
- Product detail, cart (persisted in localStorage), checkout (mock order)
- Auth: register / login with JWT, protected routes, admin-only product management
- Orders: create an order (decrements stock), view your orders, admin lists all orders
- Seed data: 12 realistic products + an admin user

## Project structure
```
ecommerce-application/
├── docker-compose.yml          # dev: mongo + server + client (Vite, :5173)
├── docker-compose.prod.yml     # prod: mongo + server + client (nginx, :80)
├── .env.example
├── server/                     # Express + Mongoose API (:5000)
│   ├── src/server.js           # app entry, exports `app` for tests
│   ├── src/config/db.js
│   ├── src/models/             # Product, User, Order
│   ├── src/routes/             # products, auth, orders
│   ├── src/middleware/auth.js  # protect + admin
│   ├── src/data/products.js    # 12 seed products
│   ├── src/seed.js             # local-dev seed only
│   └── src/__tests__/health.test.js
├── client/                     # React + Vite (:5173 dev, :80 prod via nginx)
│   ├── src/pages/              # Home, ProductDetail, Cart, Checkout, Login
│   ├── src/context/CartContext.jsx
│   └── src/api.js
└── .github/workflows/ci.yml    # test, build, docker build, compose validate
└── .github/workflows/cd.yml    # build + push images to GHCR on push to main
```

## Run locally with Docker (recommended)
```bash
cp .env.example .env
docker compose up --build
# client: http://localhost:5173
# server: http://localhost:5000/api/health
# mongo:  localhost:27017
docker compose down
```
Seed the database (local dev only, in a second terminal):
```bash
docker compose exec server npm run seed
# admin: admin@shop.local / Admin123!
```

Production-style run:
```bash
docker compose -f docker-compose.prod.yml up --build
# client (nginx): http://localhost:80
```

## Run locally without Docker
Prerequisites: Node 20+ and a MongoDB instance (local `mongod` or a free Atlas cluster).
```bash
cp .env.example .env   # set MONGO_URI to your MongoDB
# server
cd server && npm ci && npm run seed && npm run dev
# client (second terminal)
cd client && npm install && npm run dev
# client: http://localhost:5173  (Vite proxies /api to http://localhost:5000)
```

## Environment variables
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/ecommerce` | MongoDB connection string |
| `JWT_SECRET` | `dev-secret-change-me` | JWT signing secret — change in production |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `VITE_API_URL` | `/api` | Client API base (dev proxy) |

## API endpoints
Base: `/api`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Health check, `{ "status": "ok" }` (no DB needed) |
| GET | `/products?category=&search=` | — | List products |
| GET | `/products/:id` | — | One product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| POST | `/auth/register` | — | Register, returns JWT |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/auth/me` | User | Current user |
| POST | `/orders` | User | Create order, decrements stock |
| GET | `/orders/mine` | User | Your orders |
| GET | `/orders` | Admin | All orders |

## Tests
```bash
cd server && npm test   # node:test, health endpoint (no Mongo needed)
```

## Notes / shortcuts
- Checkout is a mock: it creates a real order in MongoDB, but no payment gateway is integrated.
- Images are placeholder URLs (picsum.photos) in seed data.
- The CD workflow pushes images to GHCR on push to `main`; the deploy step is commented out — add your own target (Render / Fly.io / VPS) there. Nothing is deployed by this repo.
