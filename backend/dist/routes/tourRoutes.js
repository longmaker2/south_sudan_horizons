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
const Tour_1 = __importDefault(require("../models/Tour"));
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post("/", upload_1.uploadTour.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, rating, type, description, video, price, duration } = req.body;
        const image = req.file ? `/tour_pics/${req.file.filename}` : undefined;
        const newTour = new Tour_1.default({
            title,
            rating,
            type,
            description,
            image,
            video,
            price,
            duration,
        });
        yield newTour.save();
        res.status(201).json(newTour);
    }
    catch (err) {
        console.error("Error adding tour:", err);
        res.status(500).json({ error: "Failed to add tour" });
    }
}));
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, limit } = req.query;
        let query = type ? { type } : {};
        let tours = yield Tour_1.default.find(query);
        if (limit) {
            tours = tours.slice(0, parseInt(limit));
        }
        res.json(tours);
    }
    catch (err) {
        console.error("Error fetching tours:", err);
        res.status(500).json({ error: "Failed to fetch tours" });
    }
});
const getTourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Fetching tour with ID:", id);
        const tour = yield Tour_1.default.findById(id);
        if (!tour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        res.json(tour);
    }
    catch (err) {
        console.error("Error fetching tour:", err);
        res.status(500).json({ error: "Failed to fetch tour" });
    }
});
const addTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = new Tour_1.default(req.body);
        yield newTour.save();
        res.status(201).json(newTour);
    }
    catch (err) {
        console.error("Error adding tour:", err);
        res.status(500).json({ error: "Failed to add tour" });
    }
});
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedTour = yield Tour_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedTour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        res.json(updatedTour);
    }
    catch (err) {
        console.error("Error updating tour:", err);
        res.status(500).json({ error: "Failed to update tour" });
    }
});
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTour = yield Tour_1.default.findByIdAndDelete(id);
        if (!deletedTour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        res.json({ message: "Tour deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting tour:", err);
        res.status(500).json({ error: "Failed to delete tour" });
    }
});
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { author, comment, rating } = req.body;
        if (!author || !comment || !rating) {
            res.status(400).json({ error: "Missing required review fields" });
            return;
        }
        const tour = yield Tour_1.default.findById(id);
        if (!tour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        const newReview = { author, comment, rating };
        tour.reviews.push(newReview);
        // Calculate new average rating
        const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0);
        tour.rating = totalRating / tour.reviews.length;
        yield tour.save();
        res.status(201).json(tour);
    }
    catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ error: "Failed to add review" });
    }
});
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", addTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);
router.post("/:id/reviews", addReview);
exports.default = router;
