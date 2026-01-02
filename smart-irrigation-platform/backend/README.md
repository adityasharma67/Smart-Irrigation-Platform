# Backend structure

This backend has been modularized to make it easier to explain and maintain.

- `server.js` — App entry point: sets up middleware, connects to DB, mounts routes, and starts the server.
- `db/index.js` — MongoDB connection helpers (`connectDB`, `isMongoConnected`).
- `models/` — Mongoose models (`User.js`, `Proposal.js`, `WaterUsage.js`).
- `routes/` — Express route modules:
  - `auth.js` - registration & login
  - `proposals.js` - list/create proposals
  - `waterUsage.js` - list/create water usage records
  - `users.js` - list users (for testing)
- `middleware/` — auth middleware (`auth.js`) that verifies JWTs.
- `storage/inMemory.js` — in-memory fallback data for when MongoDB isn't available.

Run locally:

```powershell
cd backend
npm install
npm start
```

If you want to use MongoDB, set `MONGODB_URI` in a `.env` file in `backend/`.
