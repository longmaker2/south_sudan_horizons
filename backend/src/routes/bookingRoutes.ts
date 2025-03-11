import express, { Request, Response, Router, NextFunction } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking";
import authenticateUser from "../middleware/auth";
import Stripe from "stripe";

// Log at module load time
console.log(
  "STRIPE_SECRET_KEY at module load:",
  process.env.STRIPE_SECRET_KEY || "Not found"
);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router: Router = express.Router();

// Create Payment Intent
router.post(
  "/create-payment-intent",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log(
        "STRIPE_SECRET_KEY in create-payment-intent:",
        process.env.STRIPE_SECRET_KEY || "Not found"
      );
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error(
          "STRIPE_SECRET_KEY is not defined in environment variables"
        );
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2025-02-24.acacia",
      });

      const { tourId, guests } = req.body;
      const userId = req.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId from token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        res.status(400).json({ error: "Invalid tourId" });
        return;
      }

      // Fetch tour price
      const Tour = mongoose.model("Tour");
      const tour = await Tour.findById(tourId);
      if (!tour) {
        res.status(404).json({ error: "Tour not found" });
        return;
      }

      const amount = tour.price * guests * 100; // Convert to cents

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { tourId, userId, guests },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Error creating payment intent:", err);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  }
);

// Create a new booking (with optional payment)
router.post(
  "/",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log(
        "STRIPE_SECRET_KEY in booking creation:",
        process.env.STRIPE_SECRET_KEY || "Not found"
      );
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error(
          "STRIPE_SECRET_KEY is not defined in environment variables"
        );
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2025-02-24.acacia",
      });

      const {
        tourId,
        name,
        email,
        guests,
        date,
        needsGuide,
        guideId,
        paymentMethod,
        paymentIntentId,
      } = req.body;
      const userId = req.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId from token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        res.status(400).json({ error: "Invalid tourId" });
        return;
      }
      if (guideId && !mongoose.Types.ObjectId.isValid(guideId)) {
        res.status(400).json({ error: "Invalid guideId" });
        return;
      }
      if (!["stripe", "cash"].includes(paymentMethod)) {
        res.status(400).json({ error: "Invalid payment method" });
        return;
      }
      if (paymentMethod === "stripe" && !paymentIntentId) {
        res
          .status(400)
          .json({ error: "Payment Intent ID is required for Stripe" });
        return;
      }

      // Base booking data
      const bookingData: any = {
        tourId,
        userId,
        name,
        email,
        guests,
        date,
        needsGuide,
        guideId: guideId || undefined,
        paymentMethod,
      };

      if (paymentMethod === "stripe") {
        // Verify payment intent status for Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        if (paymentIntent.status !== "succeeded") {
          res.status(400).json({ error: "Payment not completed" });
          return;
        }
        bookingData.paymentIntentId = paymentIntentId;
        bookingData.status = "confirmed"; // Paid, so confirmed
      } else {
        // Cash payment, no payment intent needed
        bookingData.status = "pending"; // Unpaid, awaiting cash
      }

      const newBooking = new Booking(bookingData);
      await newBooking.save();
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.status(201).json(populatedBooking);
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
);

// Get all bookings for the authenticated user
router.get(
  "/user",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(400).json({ error: "User ID not found" });
        return;
      }

      const bookings = await Booking.find({ userId })
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }
);

// Get a specific booking by ID
router.get(
  "/:id",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId from token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid booking ID" });
        return;
      }

      const booking = await Booking.findOne({ _id: id, userId })
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.json(booking);
    } catch (err) {
      console.error("Error fetching booking:", err);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  }
);

// Update a booking (date and guests)
router.put(
  "/:id",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { date, guests } = req.body;
      const userId = req.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId from token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid booking ID" });
        return;
      }
      if (!date || !guests || guests < 1) {
        res
          .status(400)
          .json({ error: "Date and a valid number of guests are required" });
        return;
      }

      const booking = await Booking.findOne({ _id: id, userId });
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      if (booking.status !== "pending") {
        res.status(400).json({ error: "Only pending bookings can be updated" });
        return;
      }

      booking.date = new Date(date);
      booking.guests = guests;
      await booking.save();

      // Repopulate after update
      const updatedBooking = await Booking.findById(id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json(updatedBooking);
    } catch (err) {
      console.error("Error updating booking:", err);
      res.status(500).json({ error: "Failed to update booking" });
    }
  }
);

// Cancel a booking
router.put(
  "/:id/cancel",
  authenticateUser,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid userId from token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid booking ID" });
        return;
      }

      const booking = await Booking.findOne({ _id: id, userId });
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      if (booking.status !== "pending") {
        res
          .status(400)
          .json({ error: "Only pending bookings can be cancelled" });
        return;
      }

      booking.status = "cancelled";
      await booking.save();
      res.status(200).json(booking);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  }
);

export default router;
