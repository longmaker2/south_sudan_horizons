import mongoose from "mongoose";

// Define the review sub-schema
const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

// Define the main tour schema
const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String, required: false },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  reviews: [ReviewSchema], // Array of reviews
  gallery: [{ type: String }], // Array of image URLs
  included: [{ type: String }], // Array of included items
  toBring: [{ type: String }], // Array of items to bring
});

// Create and export the model
const Tour = mongoose.model("Tour", TourSchema);
export default Tour;
