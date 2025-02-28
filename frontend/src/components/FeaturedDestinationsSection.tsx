import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTours } from "../utils/api"; // Updated import
import { Tour } from "../types/tours";

const FeaturedDestinationsSection = () => {
  const [destinations, setDestinations] = useState<Tour[]>([]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchTours(); // Using fetchTours from api.ts
        // Optionally limit the number of featured destinations
        setDestinations(data.slice(0, 9)); // Showing 3 featured destinations
      } catch (error) {
        console.error("Error loading destinations:", error);
      }
    };
    loadDestinations();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-green-50 text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">
        Featured Destinations
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        Explore the most popular destinations in South Sudan.
      </p>
      <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={destination.image} // Full URL is already constructed in fetchTours
              alt={destination.title}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                // Fallback image if loading fails
                (e.target as HTMLImageElement).src = "/fallback-image.jpg";
              }}
            />
            <div className="mt-4 text-left">
              <h3 className="text-xl font-bold text-green-800">
                {destination.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 uppercase">
                {destination.type}
              </p>
              <p className="mt-2 text-gray-700">{destination.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-700">
                    {destination.rating} ({Math.floor(Math.random() * 100) + 1}{" "}
                    reviews)
                  </span>
                </div>
              </div>
              <Link
                to={`/tour-details/${destination.id}`}
                className="mt-4 inline-block w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-center"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedDestinationsSection;
