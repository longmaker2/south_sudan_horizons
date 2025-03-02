import express, { Request, Response, Router, RequestHandler } from "express";
import Tour from "../models/Tour";
import { uploadTour } from "../middleware/upload";

const router: Router = express.Router();

router.post(
  "/",
  uploadTour.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, rating, type, description, video, price, duration } =
        req.body;
      const image = req.file ? `/tour_pics/${req.file.filename}` : undefined;

      const newTour = new Tour({
        title,
        rating,
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

const getTourById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
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

const addTour: RequestHandler<{}, any, any> = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.error("Error adding tour:", err);
    res.status(500).json({ error: "Failed to add tour" });
  }
};

const updateTour: RequestHandler<{ id: string }, any, any> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
    });

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

const deleteTour: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.json({ message: "Tour deleted successfully" });
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).json({ error: "Failed to delete tour" });
  }
};

const addReview: RequestHandler<
  { id: string },
  any,
  { author: string; comment: string; rating: number }
> = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, comment, rating } = req.body;

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

router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", addTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);
router.post("/:id/reviews", addReview);

export default router;
