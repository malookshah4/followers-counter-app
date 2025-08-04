import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'; // Re-enabled this
import userRoutes from './routes/userRoutes.js';
import trendRoutes from './routes/trendRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- START OF UPDATED CORS CONFIGURATION ---

// Define which origins are allowed to connect to this backend
const allowedOrigins = [
  'http://localhost:5173',
  'https://53e6f093a1b3.ngrok-free.app' // Your current ngrok URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// --- END OF UPDATED CORS CONFIGURATION ---


app.use(express.json());

// Basic Status Route
app.get("/api/v1/status", (req, res) => {
  res.json({ status: "Backend is running! 🚀" });
});

// API Routes
app.use('/api/v1/auth', authRoutes); // Re-enabled this
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/trends', trendRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});