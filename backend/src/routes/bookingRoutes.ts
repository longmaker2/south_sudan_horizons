import express, { Request, Response, Router, NextFunction } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking";
import authenticateUser from "../middleware/auth";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router: Router = express.Router();

// Create a new booking
router.post(
  "/",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { tourId, name, email, guests, date, needsGuide, guideId } =
        req.body;
      const userId = req.userId; // Get the user ID from the authenticated request

      // Validate tourId and userId
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        res.status(400).json({ error: "Invalid tourId" });
        return;
      }
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId" });
        return;
      }

      // Validate guideId
      if (guideId && !mongoose.Types.ObjectId.isValid(guideId)) {
        res.status(400).json({ error: "Invalid guideId" });
        return;
      }

      const newBooking = new Booking({
        tourId,
        userId,
        name,
        email,
        guests,
        date,
        needsGuide,
        guideId: guideId || undefined,
      });

      await newBooking.save();
      res.status(201).json(newBooking);
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
);

// Get all bookings for a user
router.get(
  "/user/:userId",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const bookings = await Booking.find({ userId })
        .populate("tourId")
        .populate("guideId");
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }
);

export default router;
