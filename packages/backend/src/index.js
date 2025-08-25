import express from "express";
import cors from "cors";
import dotenv from "dotenv";


console.log("--- SERVER STARTING: CHECKING ENVIRONMENT VARIABLES ---");
console.log("TIKTOK_CLIENT_KEY:", process.env.TIKTOK_CLIENT_KEY ? "Loaded Successfully" : "!!! MISSING OR UNDEFINED !!!");
console.log("TIKTOK_CLIENT_SECRET:", process.env.TIKTOK_CLIENT_SECRET ? "Loaded Successfully" : "!!! MISSING OR UNDEFINED !!!");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded Successfully" : "!!! MISSING OR UNDEFINED !!!");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded Successfully" : "!!! MISSING OR UNDEFINED !!!");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("----------------------------------------------------");


import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import { initializeWebSocketServer } from './websocket.js';
import http from 'http';
import verificationRoutes from './routes/verificationRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Define which origins are allowed to connect to this backend
const allowedOrigins = [
  'http://localhost:5173',
  'https://a9e109e52e1c.ngrok-free.app' // Your current ngrok URL
];

app.use(cors({
  origin: function (origin, callback) {
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));



app.use(express.json());

// Basic Status Route
app.get("/api/v1/status", (req, res) => {
  res.json({ status: "Backend is running! 🚀" });
});

// API Routes
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/verify', verificationRoutes);

const server = http.createServer(app);

initializeWebSocketServer(server);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});