
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// Fail-safe check: verify critical environment variables before starting
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.error(
    `[FATAL] Missing required environment variable(s): ${missingEnvVars.join(", ")}`
  );
  console.error("The application cannot start securely without these variables. Exiting.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Trust reverse proxy (Render, Cloudflare, etc.) for rate limiter IP resolution
app.set("trust proxy", 1);

// Security Headers & Fingerprint Removal
app.use(helmet());
app.disable("x-powered-by");

const allowedOrigins = [
"https://sigmagpt-frontend-bqlz.onrender.com",
  process.env.FRONTEND_URL
].filter(Boolean);

// In local development, also allow Vite local dev origins
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Global API rate limiter (150 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." }
});
app.use("/api", globalLimiter);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);

// Chatbot routes
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("SigmaGPT Backend is running!");
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Access denied by CORS policy." });
  }

  console.error("Unhandled error:", err.message);
  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error." : err.message
  });
});

// Connect MongoDB first, then start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();




