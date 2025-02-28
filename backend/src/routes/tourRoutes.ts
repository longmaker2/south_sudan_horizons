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

/**
 * 📌 Get all tours with optional type and limit query parameters
 * Example: GET /api/tours?type=Adventure&limit=5
 */
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

/**
 * 📌 Get a single tour by ID
 * Example: GET /api/tours/:id
 */
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

/**
 * 📌 Add a new tour
 * Example: POST /api/tours
 */
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

/**
 * 📌 Update a tour by ID
 * Example: PUT /api/tours/:id
 */
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

/**
 * 📌 Delete a tour by ID
 * Example: DELETE /api/tours/:id
 */
const deleteTour: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.json({ message: "Tour deleted successfully" });
    return;
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).json({ error: "Failed to delete tour" });
  }
};

router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", addTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);

export default router;
