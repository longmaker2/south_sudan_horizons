import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Booking from "../components/Booking";
import TourDetail from "../components/TourDetail";
import SimilarTours from "../components/SimilarTours";
import { Tour } from "../types/tours";
import { fetchTourDetails, fetchTours, submitReview } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const [tour, setTour] = useState<Tour | null>(null);
  const [similarTours, setSimilarTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const [newReview, setNewReview] = useState({
    author: user?.fullName || "",
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

        if (!user) {
          navigate("/login");
          return;
        }

        const tourData = await fetchTourDetails(id);
        console.log("Fetched tour data:", tourData);

        if (!tourData) {
          throw new Error("Tour not found.");
        }
        setTour(tourData);

        const allTours = await fetchTours();
        const similar = allTours
          .filter((t) => t.type === tourData.type && t._id !== tourData._id)
          .slice(0, 3);
        setSimilarTours(similar);

        // Update author if user changes after initial load
        setNewReview((prev) => ({
          ...prev,
          author: user?.fullName || "",
        }));
      } catch (error) {
        console.error("Failed to fetch tour details:", error);
        setError("Failed to load tour details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTourDetails();
  }, [id, user, navigate]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.author || !newReview.comment || newReview.rating <= 0) {
      setReviewError("Please provide a comment and a rating.");
      return;
    }

    try {
      const updatedTour = await submitReview(id!, newReview);
      setTour(updatedTour);
      setNewReview({ author: user?.fullName || "", comment: "", rating: 0 });
      setReviewSuccess("Your review has been submitted successfully!");
      setReviewError(null);
      setTimeout(() => setReviewSuccess(null), 5000);
    } catch (error) {
      if (error instanceof Error) {
        setReviewError(
          error.message || "Failed to submit review. Please try again."
        );
      } else {
        setReviewError("Failed to submit review. Please try again.");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading tour details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Tour not found
          </h2>
          <p className="mt-2 text-gray-700">
            Please go back and select a valid tour.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
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
          ← Back to Tours
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TourDetail
            tour={tour}
            handleReviewSubmit={handleReviewSubmit}
            newReview={newReview}
            setNewReview={setNewReview}
            getInitials={getInitials}
            reviewError={reviewError}
            reviewSuccess={reviewSuccess}
          />
          <Booking tourId={tour._id.toString()} />
        </div>

        <SimilarTours similarTours={similarTours} />
      </div>
    </motion.div>
  );
};

export default TourDetails;
