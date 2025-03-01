import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Booking from "../components/Booking";
import TourDetail from "../components/TourDetail";
import SimilarTours from "../components/SimilarTours";
import { Tour } from "../types/tours";
import { fetchTourDetails, fetchTours, submitReview } from "../utils/api";

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [similarTours, setSimilarTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReview, setNewReview] = useState({
    author: "",
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    const loadTourDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Tour ID is missing.");
        }

        // Fetch tour details
        const tourData = await fetchTourDetails(id);
        console.log("Fetched tour data:", tourData);

        if (!tourData) {
          throw new Error("Tour not found.");
        }
        setTour(tourData);

        // Fetch similar tours
        const allTours = await fetchTours();
        const similar = allTours
          .filter((t) => t.type === tourData.type && t.id !== tourData.id)
          .slice(0, 3);
        setSimilarTours(similar);
      } catch (error) {
        console.error("Failed to fetch tour details:", error);
        setError("Failed to load tour details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTourDetails();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newReview.author && newReview.comment && newReview.rating > 0 && id) {
      try {
        // Submit the review to the backend
        const updatedTour = await submitReview(id, newReview);

        // Update the local state with the updated tour
        setTour(updatedTour);

        // Reset the form
        setNewReview({ author: "", comment: "", rating: 0 });
      } catch (error) {
        console.error("Failed to submit review:", error);
        setError("Failed to submit review. Please try again.");
      }
    }
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-700">
        <p>Loading tour details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-700">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        <p>Please go back and try again.</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-12 text-gray-700">
        <h2 className="text-2xl font-semibold text-red-600">Tour not found</h2>
        <p>Please go back and select a valid tour.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 mt-12"
    >
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          &larr; Back to Tours
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TourDetail
            tour={tour}
            handleReviewSubmit={handleReviewSubmit}
            newReview={newReview}
            setNewReview={setNewReview}
            getInitials={getInitials}
          />

          <Booking tourId={tour.id.toString()} />
        </div>

        <SimilarTours similarTours={similarTours} />
      </div>
    </motion.div>
  );
};

export default TourDetails;
