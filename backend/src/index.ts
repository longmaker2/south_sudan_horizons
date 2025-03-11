import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import fs from "fs";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import tourRoutes from "./routes/tourRoutes";
import bookingRoutes from "./routes/bookingRoutes";

// Debug the .env path and load environment variables
const envPath = path.resolve(__dirname, ".env");
console.log("Looking for .env at:", envPath);
if (!fs.existsSync(envPath)) {
  console.error(".env file not found at:", envPath);
  process.exit(1);
}
dotenv.config({ path: envPath });
console.log("Environment variables loaded in index.ts");
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY || "Not found");
console.log("MONGO_URI:", process.env.MONGO_URI || "Not found");

// Check critical environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.MONGO_URI) {
  console.error(
    "Required environment variables (STRIPE_SECRET_KEY or MONGO_URI) are missing. Check your .env file."
  );
  process.exit(1);
}

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Ensure directories exist for static files
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

// Root route with a user-friendly message
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hello! This is the South Sudan Horizons API. To explore tours, bookings, or user services, please use the appropriate endpoints (e.g., /api/tours, /api/bookings, /api/auth).",
  });
});

// Base API route to avoid "Cannot GET /api" error
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API base route. Use /api/auth, /api/tours, or /api/bookings",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);

// Global error handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server with error handling after connecting to MongoDB
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
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
  })
  .catch((err) => {
    console.error(
      "Failed to start server due to MongoDB connection error:",
      err
    );
    process.exit(1);
  });
