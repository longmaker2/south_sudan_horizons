"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
// Load environment variables from backend/.env locally, fallback to system env vars in production
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Serve static files for profile pictures (uploads folder)
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Serve static files for tour images (tour_pics folder)
app.use("/tour_pics", express_1.default.static(path_1.default.join(process.cwd(), "tour_pics")));
// Connect to MongoDB
(0, db_1.default)();
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tours", tourRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
