"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Profile Picture Storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|svg|gif/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images are allowed"));
        }
    },
});
// Fetch User Profile (single endpoint)
router.get("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Profile request - Decoded token:", decoded);
        const user = yield User_1.default.findById(decoded.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture || null,
            role: user.role,
        });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}));
// Update Profile with Profile Picture Upload
router.post("/update-profile", upload.single("profilePicture"), // Use the upload middleware here
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { fullName, email } = req.body;
        // Handle the uploaded file
        const profilePicture = req.file
            ? `/uploads/${req.file.filename}`
            : undefined;
        const updatedUser = yield User_1.default.findByIdAndUpdate(decoded.id, Object.assign({ fullName: fullName || undefined, email: email || undefined }, (profilePicture && { profilePicture })), { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture || null,
            role: updatedUser.role,
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Register Route
router.post("/register", [
    (0, express_validator_1.body)("fullName", "Full name is required").notEmpty(),
    (0, express_validator_1.body)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.body)("password", "Password must be at least 8 characters").isLength({
        min: 8,
    }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { fullName, email, password, role, key } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        if (role === "guide" && key !== process.env.GUIDES_KEY) {
            res.status(400).json({ message: "Invalid guide key" });
            return;
        }
        if (role === "admin" && key !== process.env.ADMIN_KEY) {
            res.status(400).json({ message: "Invalid admin key" });
            return;
        }
        user = new User_1.default({ fullName, email, password, role });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" } // Extend token expiry to 7 days
        );
        res.status(201).json({ token });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Login Route
router.post("/login", [
    (0, express_validator_1.body)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.body)("password", "Password is required").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password, role, key } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        if (role === "guide" && key !== process.env.GUIDES_KEY) {
            res.status(400).json({ message: "Invalid guide key" });
            return;
        }
        if (role === "admin" && key !== process.env.ADMIN_KEY) {
            res.status(400).json({ message: "Invalid admin key" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" } // Extend token expiry to 7 days
        );
        res.status(200).json({
            token,
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
