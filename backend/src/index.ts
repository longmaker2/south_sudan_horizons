import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes"; // Import auth routes
import tourRoutes from "./routes/tourRoutes"; // Import tour routes

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Serve static files for profile pictures (uploads folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve static files for tour images (tour_pics folder)
app.use("/tour_pics", express.static(path.join(process.cwd(), "tour_pics")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes); // Register tour routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
