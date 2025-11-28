# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Server running on http://localhost:4000
📊 MongoDB: Not connected (using in-memory storage)
```

**Note**: MongoDB is optional! The app works perfectly without it using in-memory storage.

### Step 3: Start Frontend

Open a new terminal:
```bash
cd frontend
npm start
```

The browser will automatically open at `http://localhost:3000`

### Step 4: Test the Application

1. **Register a new user:**
   - Click "Register"
   - Fill in the form (choose "Farmer" or "Service Provider")
   - Click "Register"

2. **Login:**
   - Use your email and password
   - Click "Login"

3. **Explore:**
   - **Farmers**: Browse proposals on the dashboard
   - **Service Providers**: Create proposals and view them
   - **All Users**: Track water usage in the Water Usage section

## Default Test Accounts

You can create test accounts:
- **Farmer**: Register with role "Farmer"
- **Service Provider**: Register with role "Service Provider"
- **Manufacturer**: Register with role "Manufacturer"

## Troubleshooting

### Port Already in Use
If port 3000 or 4000 is already in use:
- Backend: Create `.env` file with `PORT=4001`
- Frontend: Create `.env` file with `PORT=3001`

### MongoDB Connection (Optional)
If you want to use MongoDB:
1. Install MongoDB
2. Create `.env` file in backend:
   ```
   MONGODB_URI=mongodb://localhost:27017/smart-irrigation
   JWT_SECRET=your-secret-key
   PORT=4000
   ```
3. Start MongoDB service
4. Restart backend server

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints in the README
- Customize the application for your needs

Happy coding! 🚀

