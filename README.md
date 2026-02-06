# 🌾 Smart Irrigation Platform

A full-stack web application that connects farmers with service providers for efficient irrigation solutions. The platform enables farmers to browse irrigation proposals, track water usage, and connect with service providers offering irrigation solutions.

## Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 👨‍🌾 **Farmer Dashboard**: Browse irrigation proposals from service providers
- 🔧 **Service Provider Dashboard**: Create and manage irrigation proposals
- 💧 **Water Usage Management**: Track and monitor water usage for fields
- 📊 **Real-time Data**: View proposals and water usage data in real-time
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and Framer Motion

## Tech Stack

### Frontend
- React 19.2.0
- React Router DOM 6.21.1
- Tailwind CSS 3.3.6
- Framer Motion 10.16.16
- Axios 1.6.2

### Backend
- Node.js
- Express 4.18.2
- MongoDB with Mongoose 8.0.3
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - the app works with in-memory storage if MongoDB is not available)

## Installation

### 1. Clone the repository

```bash
cd smart-irrigation-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/smart-irrigation
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=4000
```

**Note**: If you don't have MongoDB installed, the application will automatically use in-memory storage. The app will work perfectly fine without MongoDB for development purposes.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:4000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Usage

### For Farmers

1. **Register**: Create an account with role "Farmer"
2. **Login**: Login to your account
3. **Browse Proposals**: View available irrigation proposals on the dashboard
4. **Track Water Usage**: Monitor water usage for your fields

### For Service Providers

1. **Register**: Create an account with role "Service Provider"
2. **Login**: Login to your account
3. **Create Proposals**: Create irrigation proposals with details like title, description, price, and target crops
4. **Manage Proposals**: View and manage your proposals on the dashboard

### For Manufacturers

1. **Register**: Create an account with role "Manufacturer"
2. **Login**: Login to your account
3. **Browse Platform**: Explore the platform features

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Proposals
- `GET /api/proposals` - Get all active proposals
- `POST /api/proposals` - Create a new proposal (requires authentication)

### Water Usage
- `GET /api/water-usage` - Get all water usage records
- `POST /api/water-usage` - Create a new water usage record (requires authentication)

### Users
- `GET /api/users` - Get all users (for testing)

### Health Check
- `GET /api/health` - Check server status and MongoDB connection

## Project Structure

```
smart-irrigation-platform/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables example
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── CreateProposal.jsx
│   │   │   └── WaterUsage.jsx
│   │   ├── App.js         # Main App component with routing
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Tailwind CSS imports
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
└── README.md              # This file
```

## Features in Detail

### Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (Farmer, Service Provider, Manufacturer)

### Proposals System
- Service providers can create irrigation proposals
- Farmers can browse all available proposals
- Proposals include title, description, price, and target crops
- Real-time proposal display with images

### Water Usage Tracking
- Track water usage for different fields
- Monitor status (Optimal, High, Low)
- Add new water usage records
- Visual display of water usage data

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string (optional)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Port number for the backend server (default: 4000)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts React development server
```

## Troubleshooting

### MongoDB Connection Issues
If you don't have MongoDB installed, the application will automatically use in-memory storage. This is perfect for development and testing. All data will be lost when the server restarts.

### Port Already in Use
If port 4000 or 3000 is already in use, you can change the port:
- Backend: Update `PORT` in `.env` file
- Frontend: Create a `.env` file in the frontend directory with `PORT=3001`

### CORS Issues
The backend is configured to allow requests from `http://localhost:3000`. If you change the frontend port, update the CORS configuration in `backend/server.js`.

## Future Enhancements

- [ ] Real-time notifications
- [ ] Chat system between farmers and service providers
- [ ] Payment integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app
- [ ] IoT device integration for real-time water monitoring
- [ ] Weather integration for irrigation recommendations
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

Made with ❤️ for smart irrigation solutions

