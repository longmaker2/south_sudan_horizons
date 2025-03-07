import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import multer from "multer";
import path from "path";

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
    const filetypes = /jpeg|jpg|png|gif/;
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

// Fetch User Profile (single endpoint)
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

// Update Profile
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
        id: updatedUser._id,
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

// Register Route
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

    const { fullName, email, password, role, key } = req.body;

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
        { expiresIn: "1h" }
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login Route
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

    const { email, password, role, key } = req.body;

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

      if (role === "guide" && key !== process.env.GUIDES_KEY) {
        res.status(400).json({ message: "Invalid guide key" });
        return;
      }
      if (role === "admin" && key !== process.env.ADMIN_KEY) {
        res.status(400).json({ message: "Invalid admin key" });
        return;
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
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

export default router;
