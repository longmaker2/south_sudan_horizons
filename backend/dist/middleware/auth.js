"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables.");
        res.status(500).json({ error: "Server configuration error" });
        return;
    }
    try {
        console.log("Verifying token:", token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.userId = decoded.id || decoded.userId || decoded._id;
        if (!req.userId) {
            throw new Error("No valid user ID found in token");
        }
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ error: "Invalid token." });
    }
};
exports.default = authenticateUser;
