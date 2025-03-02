import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, default: 0 },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String, required: false },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  reviews: [ReviewSchema],
  gallery: [{ type: String }],
  included: [{ type: String }],
  toBring: [{ type: String }],
});

const Tour = mongoose.model("Tour", TourSchema);
export default Tour;
