# Deploy — host the full app for free

Recommended free stack (no card needed, fits the zero-money-capital approach):

| Piece | Host | Free tier |
|---|---|---|
| Frontend | GitHub Pages | Free, static only — already wired up in `.github/workflows/pages.yml` |
| Backend (Express API) | Render — free web service | 750 instance hours/month, sleeps after 15 min idle, first request ~30–60 s to wake |
| Database | MongoDB Atlas — M0 cluster | 512 MB, free forever, no card for M0 |

Live URLs once done:
- Frontend: `https://ahmadhossamx.github.io/ecommerce-application/`
- Backend: `https://ecommerce-api.onrender.com` (Render picks the exact name; use the URL it gives you)

## 1. Database — MongoDB Atlas (10 min)
1. Sign up / sign in at cloud.mongodb.com, create a project.
2. Build a Database → **M0 Free** → any region close to Render (Frankfurt is used in `render.yaml`).
3. Database Access → Add a database user (username + strong password, save them).
4. Network Access → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`) — Render's free tier has no static outbound IP.
5. Connect → Drivers → copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority`
   Replace `<user>` / `<password>` with the user you created. This is your `MONGO_URI` — never commit it.

## 2. Backend — Render (10 min)
1. Sign in at render.com (you already have a Render account — the subprocessor email came to your Gmail on 2026-11-11). Connect your GitHub account.
2. New → **Blueprint** → select `ahmadhossamx/ecommerce-application` → Render reads `render.yaml` and creates a web service called `ecommerce-api`.
   - Or, manually: New → Web Service → pick the repo, Root Directory `server`, Build Command `npm ci`, Start Command `node src/server.js`, Instance Type **Free**.
3. In the service → Environment, set:
   - `MONGO_URI` = your Atlas connection string from step 1
   - `JWT_SECRET` = a long random string (Render can generate one if you use the Blueprint)
   - `CLIENT_URL` = `https://ahmadhossamx.github.io`
   - `PORT` = `10000` (Render sets this itself; the app already reads `process.env.PORT`)
4. Deploy. Check `https://<your-service>.onrender.com/api/health` — it should return `{"status":"ok"}`. Note: the first request after idle takes ~30–60 s.
5. Seed the database once (optional, from your own machine with the Atlas URI):
   ```bash
   cd server
   MONGO_URI="<your Atlas string>" npm run seed
   # admin: admin@shop.local / Admin123! — change this password after first login
   ```

## 3. Frontend — GitHub Pages (already prepared)
1. Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Repo → Settings → Secrets and variables → Actions → Variables → New variable:
   - Name: `VITE_API_URL`, Value: `https://<your-service>.onrender.com/api`
   (Use the exact Render URL from step 2 — without this, the site stays in demo mode with sample products.)
3. Push to `main` (or re-run the Pages workflow). The site goes live at
   `https://ahmadhossamx.github.io/ecommerce-application/`

## 4. Check it end to end
- Open the Pages URL, products should load from the API (not "Demo mode").
- Register / log in, add to cart, place an order — the order should appear in MongoDB Atlas (Browse Collections → ecommerce → orders).
- If products don't load: open the browser console, check the API URL, and check Render logs for MongoDB connection errors (usually a wrong `MONGO_URI` or Atlas network access).

## Limits to know
- Render free sleeps after 15 min idle — first visit after a quiet spell is slow. Paid Starter ($7/month) stays awake.
- Atlas M0 is 512 MB — plenty for this demo, not for a real store with lots of orders.
- Vercel Hobby is an alternative frontend host, but GitHub Pages is already wired up and free, so use Pages unless you need Vercel features.
- Never put `MONGO_URI`, `JWT_SECRET`, or any password in the repo, in a GitHub issue, or in chat. They go only in Render's Environment settings.
