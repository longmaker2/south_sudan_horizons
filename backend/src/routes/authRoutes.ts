import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env from backend/src/.env if it’s there, otherwise fallback to backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// Another option of keeping .env in backend/src/, I can use the below instead of the above:
// dotenv.config({ path: path.resolve(__dirname, ".env") });

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

// Email transporter setup with explicit settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

// Log credentials at transporter creation to debug
console.log("Transporter initialized with:", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "[REDACTED]" : "Not Set",
});

// Delay verification until after server startup
setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Transporter Verification Failed:", error);
    } else {
      console.log("SMTP Transporter Ready:", success);
    }
  });
}, 2000); // Delay by 2 seconds

// Utility to send verification email
const sendVerificationEmail = async (email: string, token: string) => {
  console.log("Sending verification email with credentials:", {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? "[REDACTED]" : "Not Set",
  });

  const verificationUrl =
    process.env.NODE_ENV === "production"
      ? `https://south-sudan-horizons.vercel.app/verify-email?token=${token}` // Point to Vercel frontend
      : `http://localhost:5173/verify-email?token=${token}`; // Local frontend

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - South Sudan Horizons",
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>. This link expires in 1 hour.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Test SMTP route
router.get("/test-email", async (req: Request, res: Response) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "l.deng@alustudent.com",
      subject: "Test Email from South Sudan Horizons",
      text: "This is a test email to verify SMTP configuration.",
    });
    console.log("Test email sent:", info.response);
    res.status(200).json({ message: "Test email sent successfully", info });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ message: "Failed to send test email", error });
  }
});

// Middleware to check if user is admin (unchanged)
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
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Fetch User Profile (unchanged)
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

// Update Profile with Profile Picture Upload (unchanged)
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

// Register Route (public) with email verification
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

      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      user = new User({
        fullName,
        email,
        password,
        role,
        verificationToken,
        isVerified: false,
      });
      await user.save();

      await sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: "Registration successful. Please verify your email.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// Email Verification Route (unchanged)
router.get("/verify-email", async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      email: string;
    };
    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res
      .status(200)
      .json({ message: "Email verified successfully", token: authToken });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ message: "Invalid or expired verification token" });
  }
});

// Login Route (unchanged)
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

      if (!user.isVerified) {
        res
          .status(403)
          .json({ message: "Please verify your email before logging in." });
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

// Get all users (admin only) (unchanged)
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
          isVerified: user.isVerified,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get a specific user by ID (admin only) (unchanged)
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
        isVerified: user.isVerified,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create a new user (admin only) (unchanged)
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

      user = new User({ fullName, email, password, role, isVerified: true });
      await user.save();

      res.status(201).json({
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update a user (admin only) (unchanged)
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
      if (password) user.password = password;
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
        isVerified: updatedUser!.isVerified,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// Delete a user (admin only) (unchanged)
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

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

export default router;
