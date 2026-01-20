# Smart Irrigation Platform

Smart Irrigation Platform is a full-stack web application for monitoring and managing irrigation and water usage for agricultural or garden deployments. It provides user authentication, an interactive dashboard, proposal management for irrigation plans, and water-usage tracking to help optimize scheduling and conserve water.

## Key Features

- User authentication and authorization
- Dashboard with summaries and quick actions
- Create, review, and manage irrigation proposals
- Log and visualize water usage data
- Support and contact pages

## Tech Stack

- Frontend: React, React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT (jsonwebtoken), bcrypt for password hashing
- HTTP client: Axios

## Quick Start (local)

1. Backend

	- Change to `smart-irrigation-platform/backend`
	- Install: `npm install`
	- Configure: create a `.env` with `MONGO_URI` and `JWT_SECRET`
	- Run: `npm run dev`

2. Frontend

	- Change to `smart-irrigation-platform/frontend`
	- Install: `npm install`
	- Run: `npm start`

Open the frontend (typically at `http://localhost:3000`) and ensure it points to the running backend API.

## Repository Layout

- `backend/` — Node/Express server, API routes, models
- `frontend/` — React application and UI components

## Contributing

Contributions welcome via issues and pull requests. Please include clear descriptions and tests where appropriate.

## License & Contact

See the repository on GitHub for license information and to contact the maintainers.
