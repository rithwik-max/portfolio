# 🚀 Full Stack Portfolio — MERN

A complete full stack portfolio website with real user authentication, project management dashboard, and contact form. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Authentication** — Register, login, JWT-based sessions, protected routes
- **Portfolio** — Public home, projects, and contact pages
- **Dashboard** — Protected admin panel to add/edit/delete projects
- **Messages** — Contact form saves to DB, viewable in dashboard
- **Deployment-ready** — Configured for Vercel (frontend) + Render (backend) + MongoDB Atlas

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (no UI library) |
| Deployment | Vercel + Render + MongoDB Atlas |

---

## 📁 Project Structure

```
portfolio/
├── server/                 ← Node.js + Express backend
│   ├── models/
│   │   ├── User.js         ← User schema with bcrypt hashing
│   │   ├── Project.js      ← Project schema
│   │   └── Message.js      ← Contact message schema
│   ├── routes/
│   │   ├── auth.js         ← /api/auth (register, login, me)
│   │   ├── projects.js     ← /api/projects (CRUD)
│   │   └── messages.js     ← /api/messages (create, list, delete)
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect + adminOnly
│   ├── index.js            ← Express app entry point
│   ├── package.json
│   └── .env.example        ← Copy to .env and fill in values
│
└── client/                 ← React (Vite) frontend
    ├── src/
    │   ├── api/
    │   │   └── axios.js    ← Axios instance with auth interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx ← Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx  ← Protected — manage projects & messages
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── vite.config.js      ← Proxies /api to localhost:5000 in dev
    └── package.json
```

---

## ⚙️ Local Setup

### 1. Clone / unzip the project

```bash
cd portfolio
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — `http://localhost:5173` for local dev

```bash
npm run dev      # starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../client
npm install
cp .env.example .env    # optional, vite proxy handles /api in dev
npm run dev              # starts on http://localhost:5173
```

Visit `http://localhost:5173` — you're live locally!

---

## 🗄️ MongoDB Atlas Setup (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Add a database user (username + password)
4. Add your IP to Network Access (or 0.0.0.0/0 for all IPs)
5. Click **Connect → Drivers** → copy the connection string
6. Replace `<password>` with your DB user's password
7. Paste into `MONGO_URI` in your `.env`

---

## 🚀 Deployment

### Frontend → Vercel

1. Push your `client/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

### Backend → Render

1. Push your `server/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service → Import repo
3. Set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables:
   - `MONGO_URI` = your Atlas URI
   - `JWT_SECRET` = your secret
   - `CLIENT_URL` = your Vercel URL (e.g. `https://your-portfolio.vercel.app`)
7. Deploy!

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Public | Get all projects |
| GET | `/api/projects/:id` | Public | Get single project |
| POST | `/api/projects` | Protected | Create project |
| PUT | `/api/projects/:id` | Protected | Update project |
| DELETE | `/api/projects/:id` | Protected | Delete project |

### Messages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/messages` | Public | Send contact message |
| GET | `/api/messages` | Protected | View all messages |
| PATCH | `/api/messages/:id/read` | Protected | Mark as read |
| DELETE | `/api/messages/:id` | Protected | Delete message |

---

## 🎨 Customization

1. **Personal info** — Edit `Home.jsx` (bio, skills) and `Contact.jsx` (email, location)
2. **Colors** — Change CSS variables in `styles.css` under `:root {}`
3. **Projects** — Add from the Dashboard after logging in
4. **Social links** — Update links in `Contact.jsx`

---

## 📝 Submission Checklist

- [x] Real user authentication (login & signup)
- [x] Backend system (Node.js + Express)
- [x] Database integration (MongoDB + Mongoose)
- [x] Protected routes with JWT
- [x] CRUD operations for projects
- [x] Contact form with DB storage
- [x] Deployment ready (Vercel + Render)
- [ ] Push to GitHub with clean commits
- [ ] Deploy and add live link
