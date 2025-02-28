import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRandomTours } from "../utils/api";
import { Tour } from "../types/tours";

const CulturalHighlightsSection = () => {
  const [culturalHighlights, setCulturalHighlights] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCulturalHighlights = async () => {
      try {
        setIsLoading(true);
        // Fetch 9 random cultural tours using "Cultural" as the type
        const data = await getRandomTours("Cultural", 9);
        setCulturalHighlights(data);
      } catch (error) {
        console.error("Error loading cultural highlights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCulturalHighlights();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-white text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">Cultural Highlights</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        Experience the vibrant traditions and cultural richness of South Sudan.
      </p>
      {isLoading ? (
        <div className="mt-8">Loading cultural highlights...</div>
      ) : (
        <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {culturalHighlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className="mt-4 text-left">
                <h3 className="text-xl font-bold text-green-800">
                  {highlight.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 uppercase">
                  {highlight.type}
                </p>
                <p className="mt-2 text-gray-700">{highlight.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-700">
                      {highlight.rating} ({Math.floor(Math.random() * 100) + 1}{" "}
                      reviews)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/tour-details/${highlight.id}`}
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

export default CulturalHighlightsSection;
