import express, { Request, Response, Router, NextFunction } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking";
import authenticateUser from "../middleware/auth";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

console.log(
  "STRIPE_SECRET_KEY at module load:",
  process.env.STRIPE_SECRET_KEY || "Not found"
);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router: Router = express.Router();

// Middleware to check if user is admin
const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token provided in isAdmin middleware");
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    console.log("Decoded token in isAdmin:", decoded);
    if (decoded.role !== "admin") {
      console.log(`User ${decoded.id} is not admin. Role: ${decoded.role}`);
      res.status(403).json({ error: "Access denied. Admin only." });
      return;
    }
    req.userId = decoded.id; // Ensure userId is set for admin requests
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Create Payment Intent (for tourists)
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

      if (!userId) {
        console.error("No userId provided in token");
        res.status(400).json({ error: "No user ID provided in token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        console.error("Invalid tourId:", tourId);
        res.status(400).json({ error: "Invalid tourId format" });
        return;
      }
      if (!guests || guests < 1) {
        console.error("Invalid guests value:", guests);
        res.status(400).json({ error: "Guests must be a positive number" });
        return;
      }

      const Tour = mongoose.model("Tour");
      const tour = await Tour.findById(tourId);
      if (!tour) {
        console.log(`Tour not found for ID: ${tourId}`);
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

// Create a new booking (for tourists)
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

      if (!userId) {
        console.error("No userId provided in token");
        res.status(400).json({ error: "No user ID provided in token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        console.error("Invalid tourId:", tourId);
        res.status(400).json({ error: "Invalid tourId format" });
        return;
      }
      if (guideId && !mongoose.Types.ObjectId.isValid(guideId)) {
        console.error("Invalid guideId:", guideId);
        res.status(400).json({ error: "Invalid guideId format" });
        return;
      }
      if (!["stripe", "cash"].includes(paymentMethod)) {
        console.error("Invalid payment method:", paymentMethod);
        res.status(400).json({ error: "Invalid payment method" });
        return;
      }
      if (paymentMethod === "stripe" && !paymentIntentId) {
        console.error("Missing paymentIntentId for stripe payment");
        res
          .status(400)
          .json({ error: "Payment Intent ID is required for Stripe" });
        return;
      }
      if (!name || !email || !guests || !date) {
        console.error("Missing required fields:", {
          name,
          email,
          guests,
          date,
        });
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

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
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        if (paymentIntent.status !== "succeeded") {
          console.error("Payment not completed for intent:", paymentIntentId);
          res.status(400).json({ error: "Payment not completed" });
          return;
        }
        bookingData.paymentIntentId = paymentIntentId;
        bookingData.status = "confirmed";
      } else {
        bookingData.status = "pending";
      }

      const newBooking = new Booking(bookingData);
      await newBooking.save();
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res
        .status(201)
        .json({ ...populatedBooking!.toObject(), id: populatedBooking!._id });
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
);

// Get all bookings for the authenticated user (tourist)
router.get(
  "/user",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        console.error("User ID not found in request");
        res.status(400).json({ error: "User ID not provided in token" });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in /user endpoint");
        res.status(401).json({ error: "No token provided" });
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
      console.log("Decoded token in /user:", decoded);

      if (decoded.role === "admin") {
        console.log("Admin attempted to use /user endpoint");
        res.status(403).json({ error: "Use GET /bookings for admin access" });
        return;
      }

      const bookings = await Booking.find({ userId })
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json(bookings.map((b) => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }
);

// Get a specific booking by ID (tourist or admin)
router.get(
  "/:id",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        console.error("No userId provided in token");
        res.status(400).json({ error: "No user ID provided in token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in /:id endpoint");
        res.status(401).json({ error: "No token provided" });
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
      console.log("Decoded token in /:id:", decoded);

      let booking;
      if (decoded.role === "admin") {
        booking = await Booking.findById(id)
          .populate("tourId", "title price description")
          .populate("guideId", "fullName");
      } else {
        booking = await Booking.findOne({ _id: id, userId })
          .populate("tourId", "title price description")
          .populate("guideId", "fullName");
      }

      if (!booking) {
        console.log(`Booking not found for ID: ${id}, userId: ${userId}`);
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.json({ ...booking.toObject(), id: booking._id });
    } catch (err) {
      console.error("Error fetching booking:", err);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  }
);

// Update a booking (tourist)
router.put(
  "/:id",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { date, guests } = req.body;
      const userId = req.userId;

      if (!userId) {
        console.error("No userId provided in token");
        res.status(400).json({ error: "No user ID provided in token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }
      if (!date || !guests || guests < 1) {
        console.error("Invalid update data:", { date, guests });
        res
          .status(400)
          .json({ error: "Date and a valid number of guests are required" });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in PUT /:id");
        res.status(401).json({ error: "No token provided" });
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
      console.log("Decoded token in PUT /:id:", decoded);

      if (decoded.role === "admin") {
        console.log("Admin attempted to use tourist update endpoint");
        res
          .status(403)
          .json({ error: "Use PUT /bookings/admin/:id for admin updates" });
        return;
      }

      const booking = await Booking.findOne({ _id: id, userId });
      if (!booking) {
        console.log(`Booking not found for ID: ${id}, userId: ${userId}`);
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      if (booking.status !== "pending") {
        console.log(`Booking ${id} is not pending. Status: ${booking.status}`);
        res.status(400).json({ error: "Only pending bookings can be updated" });
        return;
      }

      booking.date = new Date(date);
      booking.guests = guests;
      await booking.save();

      const updatedBooking = await Booking.findById(id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json({ ...updatedBooking!.toObject(), id: updatedBooking!._id });
    } catch (err) {
      console.error("Error updating booking:", err);
      res.status(500).json({ error: "Failed to update booking" });
    }
  }
);

// Cancel a booking (tourist)
router.put(
  "/:id/cancel",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        console.error("No userId provided in token");
        res.status(400).json({ error: "No user ID provided in token" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in /:id/cancel");
        res.status(401).json({ error: "No token provided" });
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
      console.log("Decoded token in /:id/cancel:", decoded);

      if (decoded.role === "admin") {
        console.log("Admin attempted to use tourist cancel endpoint");
        res.status(403).json({
          error: "Use PUT /bookings/admin/:id for admin cancellation",
        });
        return;
      }

      const booking = await Booking.findOne({ _id: id, userId });
      if (!booking) {
        console.log(`Booking not found for ID: ${id}, userId: ${userId}`);
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      if (booking.status !== "pending") {
        console.log(`Booking ${id} is not pending. Status: ${booking.status}`);
        res
          .status(400)
          .json({ error: "Only pending bookings can be cancelled" });
        return;
      }

      booking.status = "cancelled";
      await booking.save();
      res.status(200).json({ ...booking.toObject(), id: booking._id });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  }
);

// Get all bookings (admin only)
router.get(
  "/",
  authenticateUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log("Fetching all bookings for admin...");
      const bookings = await Booking.find()
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json(bookings.map((b) => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
      console.error("Error fetching all bookings:", err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }
);

// Get all bookings assigned to the authenticated guide
router.get(
  "/guide",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const guideId = req.userId;
      console.log(`Guide ID from request: ${guideId}`);

      // Log the full request headers for debugging
      console.log("Request headers:", req.headers);

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in /guide endpoint");
        res.status(401).json({ error: "No token provided" });
        return;
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          role: string;
        };
        console.log("Decoded token in /guide:", decoded);
      } catch (jwtErr) {
        console.error("JWT verification failed in /guide:", jwtErr);
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      // Check if guideId is present and matches decoded.id
      if (!guideId || guideId !== decoded.id) {
        console.error(
          `Guide ID mismatch or missing: req.userId=${guideId}, decoded.id=${decoded.id}`
        );
        res.status(400).json({ error: "Invalid or missing guide ID in token" });
        return;
      }

      if (decoded.role !== "guide") {
        console.log(`User ${decoded.id} is not a guide. Role: ${decoded.role}`);
        res.status(403).json({ error: "Access denied. Guides only." });
        return;
      }

      console.log(`Fetching bookings for guideId: ${guideId}`);
      const bookings = await Booking.find({ guideId })
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");

      if (!bookings.length) {
        console.log(`No bookings found for guideId: ${guideId}`);
      } else {
        console.log(
          `Found ${bookings.length} bookings for guideId: ${guideId}`
        );
      }

      res.json(bookings.map((b) => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
      console.error("Error fetching guide bookings:", err);
      res.status(500).json({ error: "Failed to fetch guide bookings" });
    }
  }
);

// Update booking status by guide
router.put(
  "/:id/guide",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const guideId = req.userId;

      console.log(`Guide ID: ${guideId}, Booking ID: ${id}, Status: ${status}`);

      if (!guideId) {
        console.error("Guide ID not provided in token");
        res.status(400).json({ error: "Guide ID not provided in token" });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID format:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }

      if (!["confirmed", "cancelled"].includes(status)) {
        console.error("Invalid status provided:", status);
        res.status(400).json({
          error: "Invalid status. Must be 'confirmed' or 'cancelled'",
        });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.error("No token provided in /:id/guide endpoint");
        res.status(401).json({ error: "No token provided" });
        return;
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          role: string;
        };
        console.log("Decoded token in /:id/guide:", decoded);
      } catch (jwtErr) {
        console.error("JWT verification failed in /:id/guide:", jwtErr);
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      if (decoded.role !== "guide") {
        console.log(`User ${decoded.id} is not a guide. Role: ${decoded.role}`);
        res.status(403).json({ error: "Access denied. Guides only." });
        return;
      }

      console.log(
        `Guide ${guideId} updating booking ${id} to status: ${status}`
      );
      const booking = await Booking.findOne({ _id: id, guideId });
      if (!booking) {
        console.log(
          `Booking ${id} not found or not assigned to guide ${guideId}`
        );
        res
          .status(404)
          .json({ error: "Booking not found or not assigned to this guide" });
        return;
      }

      if (booking.status !== "pending") {
        console.log(
          `Booking ${id} is not pending. Current status: ${booking.status}`
        );
        res.status(400).json({ error: "Only pending bookings can be updated" });
        return;
      }

      booking.status = status;
      await booking.save();

      const updatedBooking = await Booking.findById(id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      console.log(`Booking ${id} updated to ${status} by guide ${guideId}`);
      res.json({ ...updatedBooking!.toObject(), id: updatedBooking!._id });
    } catch (err) {
      console.error("Error updating booking status by guide:", err);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  }
);

// Admin: Create a new booking
router.post(
  "/admin",
  authenticateUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log("Creating booking by admin:", req.body);
      const {
        tourId,
        userId,
        name,
        email,
        guests,
        date,
        needsGuide,
        guideId,
        paymentMethod,
        status,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(tourId)) {
        console.error("Invalid tourId:", tourId);
        res.status(400).json({ error: "Invalid tourId format" });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId:", userId);
        res.status(400).json({ error: "Invalid userId format" });
        return;
      }
      if (guideId && !mongoose.Types.ObjectId.isValid(guideId)) {
        console.error("Invalid guideId:", guideId);
        res.status(400).json({ error: "Invalid guideId format" });
        return;
      }
      if (!["stripe", "cash"].includes(paymentMethod)) {
        console.error("Invalid payment method:", paymentMethod);
        res.status(400).json({ error: "Invalid payment method" });
        return;
      }
      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        console.error("Invalid status:", status);
        res.status(400).json({ error: "Invalid status" });
        return;
      }
      if (!name || !email || !guests || !date) {
        console.error("Missing required fields:", {
          name,
          email,
          guests,
          date,
        });
        res.status(400).json({
          error: "Missing required fields: name, email, guests, or date",
        });
        return;
      }

      const bookingData = {
        tourId,
        userId,
        name,
        email,
        guests,
        date: new Date(date),
        needsGuide: needsGuide || false,
        guideId: guideId || undefined,
        paymentMethod,
        status,
      };

      const newBooking = new Booking(bookingData);
      await newBooking.save();
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res
        .status(201)
        .json({ ...populatedBooking!.toObject(), id: populatedBooking!._id });
    } catch (err) {
      console.error("Error creating booking by admin:", err);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
);

// Admin: Update any booking
router.put(
  "/admin/:id",
  authenticateUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log("Updating booking by admin:", req.params.id, req.body);
      const { id } = req.params;
      const {
        tourId,
        userId,
        name,
        email,
        guests,
        date,
        needsGuide,
        guideId,
        paymentMethod,
        paymentIntentId,
        status,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        console.log(`Booking not found for ID: ${id}`);
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      if (tourId && !mongoose.Types.ObjectId.isValid(tourId)) {
        console.error("Invalid tourId:", tourId);
        res.status(400).json({ error: "Invalid tourId format" });
        return;
      }
      if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId:", userId);
        res.status(400).json({ error: "Invalid userId format" });
        return;
      }
      if (guideId && !mongoose.Types.ObjectId.isValid(guideId)) {
        console.error("Invalid guideId:", guideId);
        res.status(400).json({ error: "Invalid guideId format" });
        return;
      }
      if (paymentMethod && !["stripe", "cash"].includes(paymentMethod)) {
        console.error("Invalid payment method:", paymentMethod);
        res.status(400).json({ error: "Invalid payment method" });
        return;
      }
      if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
        console.error("Invalid status:", status);
        res.status(400).json({ error: "Invalid status" });
        return;
      }

      booking.tourId = tourId
        ? new mongoose.Types.ObjectId(tourId)
        : booking.tourId;
      booking.userId = userId
        ? new mongoose.Types.ObjectId(userId)
        : booking.userId;
      booking.name = name || booking.name;
      booking.email = email || booking.email;
      booking.guests = guests !== undefined ? guests : booking.guests;
      booking.date = date ? new Date(date) : booking.date;
      booking.needsGuide =
        needsGuide !== undefined ? needsGuide : booking.needsGuide;
      booking.guideId = guideId
        ? new mongoose.Types.ObjectId(guideId)
        : booking.guideId || undefined;
      booking.paymentMethod = paymentMethod || booking.paymentMethod;
      booking.paymentIntentId = paymentIntentId || booking.paymentIntentId;
      booking.status = status || booking.status;

      await booking.save();
      const updatedBooking = await Booking.findById(id)
        .populate("tourId", "title price description")
        .populate("guideId", "fullName");
      res.json({ ...updatedBooking!.toObject(), id: updatedBooking!._id });
    } catch (err) {
      console.error("Error updating booking by admin:", err);
      res.status(500).json({ error: "Failed to update booking" });
    }
  }
);

// Admin: Delete a booking
router.delete(
  "/:id",
  authenticateUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log("Deleting booking by admin:", req.params.id);
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid booking ID:", id);
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
      }

      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) {
        console.log(`Booking not found for ID: ${id}`);
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(204).send(); // No content on successful deletion
    } catch (err) {
      console.error("Error deleting booking:", err);
      res.status(500).json({ error: "Failed to delete booking" });
    }
  }
);

export default router;
