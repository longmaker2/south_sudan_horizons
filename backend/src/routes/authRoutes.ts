import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";

const router = express.Router();

// Profile Picture Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|svg|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Access denied. Admin only." });
      return;
    }
    // Assign userId to req for consistency with other routes
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Fetch User Profile (single endpoint for authenticated user)
router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    console.log("Profile request - Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture || null,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Update Profile with Profile Picture Upload (for authenticated user)
router.post(
  "/update-profile",
  upload.single("profilePicture"),
  async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      const { fullName, email } = req.body;

      const profilePicture = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;

      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        {
          fullName: fullName || undefined,
          email: email || undefined,
          ...(profilePicture && { profilePicture }),
        },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        _id: updatedUser._id,
        id: updatedUser._id, // Match frontend expectation
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture || null,
        role: updatedUser.role,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Register Route (public)
router.post(
  "/register",
  [
    body("fullName", "Full name is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { fullName, email, password, role = "tourist", key } = req.body;

    try {
      let user = await User.findOne({ email });
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

      user = new User({ fullName, email, password, role });
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login Route (public)
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        token,
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users (admin only)
router.get(
  "/users",
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Fetching all users for admin...");
      const users = await User.find().select("-password");
      res.status(200).json(
        users.map((user) => ({
          _id: user._id,
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture || null,
          role: user.role,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get a specific user by ID (admin only)
router.get(
  "/users/:id",
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const user = await User.findById(id).select("-password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture || null,
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create a new user (admin only)
router.post(
  "/users",
  isAdmin,
  [
    body("fullName", "Full name is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
    body("role", "Role is required").isIn(["tourist", "guide", "admin"]),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { fullName, email, password, role } = req.body;

    try {
      console.log("Creating user by admin:", { fullName, email, role });
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      user = new User({ fullName, email, password, role });
      await user.save();

      res.status(201).json({
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update a user (admin only)
router.put(
  "/users/:id",
  isAdmin,
  upload.single("profilePicture"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { fullName, email, password, role } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const profilePicture = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;

      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      console.log("Updating user by admin:", { id, fullName, email, role });

      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      if (password) user.password = password; // Will be hashed by pre-save hook
      user.role = role || user.role;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();
      const updatedUser = await User.findById(id).select("-password");
      res.json({
        _id: updatedUser!._id,
        id: updatedUser!._id,
        fullName: updatedUser!.fullName,
        email: updatedUser!.email,
        profilePicture: updatedUser!.profilePicture || null,
        role: updatedUser!.role,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// Delete a user (admin only)
router.delete(
  "/users/:id",
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      console.log("Deleting user by admin:", id);
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(204).send(); // No content on successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

export default router;
