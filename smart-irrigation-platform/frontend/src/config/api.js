// This tells the app where the backend server is located
// If we're deploying elsewhere, we can easily change this address
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default API_BASE;
