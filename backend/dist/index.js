"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
// Debug the .env path and load environment variables
const envPath = path_1.default.resolve(__dirname, ".env");
console.log("Looking for .env at:", envPath);
if (!fs_1.default.existsSync(envPath)) {
    console.error(".env file not found at:", envPath);
    process.exit(1);
}
dotenv_1.default.config({ path: envPath });
console.log("Environment variables loaded in index.ts");
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY || "Not found");
console.log("MONGO_URI:", process.env.MONGO_URI || "Not found");
// Check critical environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.MONGO_URI) {
    console.error("Required environment variables (STRIPE_SECRET_KEY or MONGO_URI) are missing. Check your .env file.");
    process.exit(1);
}
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Ensure directories exist for static files
const ensureDirectory = (dir) => {
    try {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    }
    catch (error) {
        console.error(`Failed to create directory ${dir}:`, error);
    }
};
// Create directories if they don’t exist
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
const tourPicsDir = path_1.default.join(process.cwd(), "tour_pics");
ensureDirectory(uploadsDir);
ensureDirectory(tourPicsDir);
// Serve static files for profile pictures (uploads folder)
app.use("/uploads", express_1.default.static(uploadsDir, {
    fallthrough: true, // Return 404 if file not found
    setHeaders: (res, filePath) => {
        console.log(`Serving static file: ${filePath}`);
    },
}));
// Serve static files for tour images (tour_pics folder)
app.use("/tour_pics", express_1.default.static(tourPicsDir, {
    fallthrough: true, // Return 404 if file not found
    setHeaders: (res, filePath) => {
        console.log(`Serving static file: ${filePath}`);
    },
}));
// Root route with a user-friendly message
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello! This is the South Sudan Horizons API. To explore tours, bookings, or user services, please use the appropriate endpoints (e.g., /api/tours, /api/bookings, /api/auth).",
    });
});
// Base API route to avoid "Cannot GET /api" error
app.get("/api", (req, res) => {
    res.status(200).json({
        message: "API base route. Use /api/auth, /api/tours, or /api/bookings",
    });
});
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tours", tourRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
// Serve index.html for all unknown routes (for client-side routing)
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "client", "build", "index.html"));
});
// Global error handler for unhandled routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Start the server with error handling after connecting to MongoDB
const PORT = process.env.PORT || 5000;
(0, db_1.default)()
    .then(() => {
    app
        .listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    })
        .on("error", (err) => {
        console.error(`Failed to start server on port ${PORT}:`, err);
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Please use a different port.`);
        }
        process.exit(1);
    });
})
    .catch((err) => {
    console.error("Failed to start server due to MongoDB connection error:", err);
    process.exit(1);
});
