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
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Create a new booking
router.post("/", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tourId, name, email, guests, date, needsGuide, guideId } = req.body;
        const userId = req.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid userId from token" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(tourId)) {
            res.status(400).json({ error: "Invalid tourId" });
            return;
        }
        if (guideId && !mongoose_1.default.Types.ObjectId.isValid(guideId)) {
            res.status(400).json({ error: "Invalid guideId" });
            return;
        }
        const newBooking = new Booking_1.default({
            tourId,
            userId,
            name,
            email,
            guests,
            date,
            needsGuide,
            guideId: guideId || undefined,
        });
        yield newBooking.save();
        res.status(201).json(newBooking);
    }
    catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
}));
// Get all bookings for the authenticated user
router.get("/user", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID not found" });
            return;
        }
        const bookings = yield Booking_1.default.find({ userId })
            .populate("tourId", "title price description")
            .populate("guideId", "fullName");
        res.json(bookings);
    }
    catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
}));
// Get a specific booking by ID
router.get("/:id", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid userId from token" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }
        const booking = yield Booking_1.default.findOne({ _id: id, userId })
            .populate("tourId", "title price description")
            .populate("guideId", "fullName");
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
            return;
        }
        res.json(booking);
    }
    catch (err) {
        console.error("Error fetching booking:", err);
        res.status(500).json({ error: "Failed to fetch booking" });
    }
}));
// Update a booking (date and guests)
router.put("/:id", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date, guests } = req.body;
        const userId = req.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid userId from token" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }
        if (!date || !guests || guests < 1) {
            res
                .status(400)
                .json({ error: "Date and a valid number of guests are required" });
            return;
        }
        const booking = yield Booking_1.default.findOne({ _id: id, userId });
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
        yield booking.save();
        // Repopulate after update
        const updatedBooking = yield Booking_1.default.findById(id)
            .populate("tourId", "title price description")
            .populate("guideId", "fullName");
        res.json(updatedBooking);
    }
    catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({ error: "Failed to update booking" });
    }
}));
// Cancel a booking
router.put("/:id/cancel", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid userId from token" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }
        const booking = yield Booking_1.default.findOne({ _id: id, userId });
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
        yield booking.save();
        res.status(200).json(booking);
    }
    catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
}));
exports.default = router;
