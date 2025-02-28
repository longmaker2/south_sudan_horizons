import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: Date, required: true },
  needsGuide: { type: Boolean, default: false },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
