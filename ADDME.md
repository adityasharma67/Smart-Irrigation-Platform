# Smart Irrigation Platform — Website Overview

Smart Irrigation Platform is a full-stack web application that helps users monitor, propose, and manage irrigation and water usage for agricultural or garden deployments. It provides user authentication, a dashboard for monitoring, proposal management, and water-usage tracking to help optimize irrigation schedules and conserve water.

## Key Features

- User authentication and role-based access
- Dashboard with summaries and quick actions
- Create, view, and manage irrigation proposals
- Log and visualize water usage data
- Support and contact pages for users

## Tech Stack

- Frontend: React, React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (via Mongoose)
- Auth: JSON Web Tokens (JWT), bcrypt for password hashing
- API client: Axios

## Quick Start (local)

1. Install and run backend

   - Navigate to `smart-irrigation-platform/backend`
   - Install: `npm install`
   - Start: `npm run dev` (requires MongoDB and a `.env` with connection string and JWT secret)

2. Install and run frontend

   - Navigate to `smart-irrigation-platform/frontend`
   - Install: `npm install`
   - Start: `npm start`

Open the frontend in your browser (usually at `http://localhost:3000`) and ensure the backend API URL is set correctly in the frontend config or environment.

## Contributing

Contributions are welcome. Open issues and pull requests on the repository to suggest features or fixes.

## Contact

For questions or help, refer to the repository issues or contact the project maintainers via the repo's GitHub page.
