import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";

const PopularTours = () => {
  const [popularTours, setPopularTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPopularTours = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let data: Tour[] = [];

        // Fetch all tours and sort by rating
        console.log("Fetching all tours...");
        const allTours = await fetchTours();
        console.log("fetchTours response:", allTours);

        if (allTours.length === 0) {
          throw new Error("No tours available in the database");
        }

        // Sort by rating (highest first) and take top 9
        data = allTours
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 9);

        setPopularTours(data);
      } catch (error) {
        console.error("Error loading popular tours:", error);
        setError("Failed to load popular tours. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPopularTours();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-gray-100 text-center"
    >
      <h2 className="text-4xl font-extrabold text-green-800">Popular Tours</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        Discover our top-rated tours and experience the best of South Sudan.
      </p>
      {isLoading ? (
        <div className="mt-12 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto"></div>
          <p className="mt-2">Loading popular tours...</p>
        </div>
      ) : error ? (
        <div className="mt-12 text-red-600 text-lg font-semibold">{error}</div>
      ) : popularTours.length === 0 ? (
        <div className="mt-12 text-gray-700 text-lg font-semibold">
          No popular tours available at the moment.
        </div>
      ) : (
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {popularTours.map((tour) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800">
                  {tour.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 uppercase">
                  {tour.type}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {tour.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {renderStars(tour.rating)}
                    <span className="ml-2 text-gray-700 font-medium">
                      {tour.rating.toFixed(1)} ({tour.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/tour-details/${tour._id}`}
                  className="mt-4 block w-full px-6 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PopularTours;
