import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import fs from "fs";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import tourRoutes from "./routes/tourRoutes";
import bookingRoutes from "./routes/bookingRoutes";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Ensures directories exist for static files
const ensureDirectory = (dir: string) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  } catch (error) {
    console.error(`Failed to create directory ${dir}:`, error);
  }
};

// Create directories if they don’t exist
const uploadsDir = path.join(process.cwd(), "uploads");
const tourPicsDir = path.join(process.cwd(), "tour_pics");
ensureDirectory(uploadsDir);
ensureDirectory(tourPicsDir);

// Serve static files for profile pictures (uploads folder)
app.use(
  "/uploads",
  express.static(uploadsDir, {
    fallthrough: true, // Return 404 if file not found
    setHeaders: (res, filePath) => {
      console.log(`Serving static file: ${filePath}`);
    },
  })
);

// Serve static files for tour images (tour_pics folder)
app.use(
  "/tour_pics",
  express.static(tourPicsDir, {
    fallthrough: true, // Return 404 if file not found
    setHeaders: (res, filePath) => {
      console.log(`Serving static file: ${filePath}`);
    },
  })
);

// Root route to avoid "Cannot GET /" error
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to South Sudan Horizons API" });
});

// Base API route to avoid "Cannot GET /api" error
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API base route. Use /api/auth, /api/tours, or /api/bookings",
  });
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);

// Global error handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server with error handling
const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    console.error(`Failed to start server on port ${PORT}:`, err);
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please use a different port.`
      );
    }
    process.exit(1);
  });
