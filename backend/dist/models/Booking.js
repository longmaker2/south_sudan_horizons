"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema = new mongoose_1.default.Schema({
    tourId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Tour", required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    guests: { type: Number, required: true },
    date: { type: Date, required: true },
    needsGuide: { type: Boolean, default: false },
    guideId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["stripe", "cash"],
        required: true,
    },
    paymentIntentId: {
        type: String,
        required: function () {
            return this.paymentMethod === "stripe";
        },
    },
    createdAt: { type: Date, default: Date.now },
});
const Booking = mongoose_1.default.model("Booking", BookingSchema);
exports.default = Booking;
