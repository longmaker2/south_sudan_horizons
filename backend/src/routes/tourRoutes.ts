import express, { Request, Response, Router, RequestHandler } from "express";
import mongoose from "mongoose";
import Tour from "../models/Tour";
import { uploadTour } from "../middleware/upload";
import jwt from "jsonwebtoken";
import authenticateUser from "../middleware/auth";

const router: Router = express.Router();

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
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Get all tours (public)
const getAllTours: RequestHandler<
  {},
  any,
  {},
  { type?: string; limit?: string }
> = async (req, res) => {
  try {
    const { type, limit } = req.query;
    let query = type ? { type } : {};
    let tours = await Tour.find(query);

    if (limit) {
      tours = tours.slice(0, parseInt(limit));
    }

    res.json(tours);
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
};

// Get a specific tour by ID (public)
const getTourById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid tour ID" });
      return;
    }

    console.log("Fetching tour with ID:", id);
    const tour = await Tour.findById(id);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.json(tour);
  } catch (err) {
    console.error("Error fetching tour:", err);
    res.status(500).json({ error: "Failed to fetch tour" });
  }
};

// Create a new tour (admin only)
router.post(
  "/",
  authenticateUser,
  isAdmin,
  uploadTour.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, rating, type, description, video, price, duration } =
        req.body;
      const image = req.file ? `/tour_pics/${req.file.filename}` : undefined;

      if (!title || !type || !description || !price || !duration) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const newTour = new Tour({
        title,
        rating: rating || 0,
        type,
        description,
        image,
        video,
        price,
        duration,
      });
      await newTour.save();

      res.status(201).json(newTour);
    } catch (err) {
      console.error("Error adding tour:", err);
      res.status(500).json({ error: "Failed to add tour" });
    }
  }
);

// Update a tour (admin only)
const updateTour: RequestHandler<{ id: string }, any, any> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid tour ID" });
      return;
    }

    const { title, rating, type, description, video, price, duration } =
      req.body;
    const image = req.file ? `/tour_pics/${req.file.filename}` : undefined;

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        title: title || undefined,
        rating: rating || undefined,
        type: type || undefined,
        description: description || undefined,
        image: image || undefined,
        video: video || undefined,
        price: price || undefined,
        duration: duration || undefined,
      },
      { new: true }
    );

    if (!updatedTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.json(updatedTour);
  } catch (err) {
    console.error("Error updating tour:", err);
    res.status(500).json({ error: "Failed to update tour" });
  }
};

// Delete a tour (admin only)
const deleteTour: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid tour ID" });
      return;
    }

    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.status(204).send(); // No content on successful deletion
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).json({ error: "Failed to delete tour" });
  }
};

// Add a review to a tour (authenticated users)
const addReview: RequestHandler<
  { id: string },
  any,
  { author: string; comment: string; rating: number }
> = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid tour ID" });
      return;
    }

    if (!author || !comment || !rating) {
      res.status(400).json({ error: "Missing required review fields" });
      return;
    }

    const tour = await Tour.findById(id);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    const newReview = { author, comment, rating };
    tour.reviews.push(newReview);

    // Calculate new average rating
    const totalRating = tour.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    tour.rating = totalRating / tour.reviews.length;

    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// Routes
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.put(
  "/:id",
  authenticateUser,
  isAdmin,
  uploadTour.single("image"),
  updateTour
); // Admin only
router.delete("/:id", authenticateUser, isAdmin, deleteTour);
router.post("/:id/reviews", authenticateUser, addReview);

export default router;
