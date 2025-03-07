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

const ensureDirectory = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDirectory(path.join(process.cwd(), "uploads"));
ensureDirectory(path.join(process.cwd(), "tour_pics"));

// Serve static files for profile pictures (uploads folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve static files for tour images (tour_pics folder)
app.use("/tour_pics", express.static(path.join(process.cwd(), "tour_pics")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
