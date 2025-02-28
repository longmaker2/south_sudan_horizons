import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRandomTours, fetchTours } from "../utils/api";
import { Tour } from "../types/tours";

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

        // Step 1: Try getRandomTours with "Popular" type
        console.log("Attempting to fetch random tours with type 'Popular'...");
        const randomToursResponse = await getRandomTours("Popular", 9);
        console.log("getRandomTours response:", randomToursResponse);

        if (randomToursResponse.length > 0) {
          data = randomToursResponse;
        } else {
          // Step 2: Fallback if no tours returned
          console.log(
            "No tours found with type 'Popular', falling back to fetchTours..."
          );
          const allTours = await fetchTours();
          console.log("fetchTours response:", allTours);

          if (allTours.length === 0) {
            throw new Error("No tours available in the database");
          }

          // Sort by rating (highest first) and take top 9, or shuffle if no rating
          data = allTours
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 9);

          // If you want truly random tours instead of rating-based:
          // data = allTours.sort(() => Math.random() - 0.5).slice(0, 9);
        }

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-gray-100 text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">Popular Tours</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        Explore our most popular tours and experience the best of South Sudan.
      </p>
      {isLoading ? (
        <div className="mt-8">Loading popular tours...</div>
      ) : error ? (
        <div className="mt-8 text-red-600">{error}</div>
      ) : popularTours.length === 0 ? (
        <div className="mt-8">No popular tours available at the moment.</div>
      ) : (
        <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularTours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className="mt-4 text-left">
                <h3 className="text-xl font-bold text-green-800">
                  {tour.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 uppercase">
                  {tour.type}
                </p>
                <p className="mt-2 text-gray-700">{tour.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-700">
                      {tour.rating || "N/A"} (
                      {Math.floor(Math.random() * 100) + 1} reviews)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/tour-details/${tour.id}`}
                  className="mt-4 inline-block w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-center"
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
