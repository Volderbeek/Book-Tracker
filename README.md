# Ohara Library 📚
A premium, full-stack MERN (MongoDB, Express, React, Node.js) book tracker application built with Vite and TypeScript. It features styled analytics, reading history log and automatic local-storage fallback for offline/database-free demonstration.

Designed for high visual fidelity with fluid layouts, dark/light mode toggles, and custom micro-animations.

---

## 🏗️ Architecture

```
C:\Users\Volde\Book Tracker
├── client/                     # Vite + React (TypeScript) frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (e.g. BookCard.tsx)
│   │   ├── utils/              # Helper utilities and business logic
│   │   ├── tests/              # Frontend Jest and React Testing Library tests
│   │   │   ├── components/     # Component unit tests (e.g. BookCard.test.tsx)
│   │   │   └── utils/          # Utility unit tests (e.g. helpers.test.ts)
│   │   ├── App.tsx             # Main dashboard controller with offline sync logic
│   │   ├── App.css             # Component-specific styles (Vanilla CSS)
│   │   ├── index.css           # Global typography & style tokens
│   │   ├── types.ts            # Type definitions (Book, User, Stats, Toast)
│   │   └── main.tsx
│   └── index.html
├── server/                     # Node.js + Express backend
│   ├── middleware/
│   │   └── auth.js             # JWT authentication and database state validation
│   ├── models/
│   │   ├── Book.js             # Mongoose MongoDB Book Schema (user-scoped ownership)
│   │   └── User.js             # Mongoose MongoDB User Schema
│   ├── routes/
│   │   ├── auth.js             # Express API endpoints for register/login/oauth stubs
│   │   └── books.js            # Express API endpoints for user-scoped CRUD + stats
│   ├── index.js                # Server entrypoint with static asset serving
│   └── .env                    # Local environment config
├── Dockerfile                  # Multi-stage production container configuration
├── fly.toml                    # Fly.io deployment config
└── package.json                # Root orchestration package
```

---

## ⚡ Key Features

1. **Library Analytics Dashboard**: Visual progress rings, completed rates, and dynamic genre distribution tracking.
2. **Current Reading Widget**: Quick access dashboard element to increment/decrement your page progress on the fly with immediate feedback.
3. **Interactive Detail Overlay**: Smooth sliders to update reading pages, status dropdowns, rating star updates, and personal review notes logging.
4. **Offline-First & Local Storage Default**: The application defaults to offline mode utilizing browser `localStorage`. Logging in syncs data with MongoDB.
5. **Multi-User Cloud Sync**: Create accounts or log in via simulated Google/Apple OAuth to sync your books to the cloud, strictly isolated by user.
6. **Graceful Outage Handling**: If a database outage is detected after logging in, the client immediately logs you out safely, returns you to offline mode, and displays an apologetic explanation.
7. **Modern Fluid UI**: Glassmorphic elements, linear glowing gradients, sleek dark mode (default) with custom scrollbars, and full responsive alignment.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port `27017` or using a MongoDB Atlas connection)

### 1. Installation
In the root directory, install orchestrator and client/server dependencies:
```bash
# Install root script orchestrators
npm install

# Installs dependencies in both client/ and server/ directories
npm run install:all
```

### 2. Environment Variables
Verify the server configuration in `server/.env`:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/booktracker
JWT_SECRET=aetheriabooks_jwt_secret_token_key_2026
```

### 3. Start Development Servers
Run the client and server concurrently with one command from the project root:
```bash
npm run dev
```
- **React Frontend**: [http://localhost:5173](http://localhost:5173) (automatically proxies `/api` calls to Express)
- **Express API**: [http://localhost:5000](http://localhost:5000)

### 4. Running Tests
Run the frontend Jest and React Testing Library tests:
```bash
npm test --prefix client
```
or navigate into the `client` directory and run:
```bash
npm test
```

---

## 🎈 Fly.io Deployment

This project contains a multi-stage `Dockerfile` and `fly.toml` config, making Fly.io deployment quick and clean. It builds the React static files and copies them into the Express server directory, serving them from the single Node.js container instance.

### Step-by-Step Deploy

1. Make sure you have the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed and are logged in.
2. Run configuration initialization:
   ```bash
   fly launch
   ```
   - When prompted to copy settings from `fly.toml`, choose **Yes**.
   - If prompted to set up a database, select your MongoDB provider or set up a serverless MongoDB instance (e.g. MongoDB Atlas).
3. Set your MongoDB connection string in Fly secrets:
   ```bash
   fly secrets set MONGODB_URI="your-mongodb-connection-string"
   ```
4. Deploy the application:
   ```bash
   fly deploy
   ```
