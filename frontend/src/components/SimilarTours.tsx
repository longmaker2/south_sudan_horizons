import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tour } from "../types/tours";

interface SimilarToursProps {
  similarTours: Tour[];
}

const SimilarTours = ({ similarTours }: SimilarToursProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 0.5 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold text-green-800">Similar Tours</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similarTours.map((similarTour, index) => (
          <motion.div
            key={similarTour.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={similarTour.image}
              alt={similarTour.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-green-800">
                {similarTour.title}
              </h3>
              <p className="mt-2 text-gray-700">{similarTour.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-700">
                    {similarTour.rating} ({Math.floor(Math.random() * 100) + 1}{" "}
                    reviews)
                  </span>
                </div>
              </div>
              <Link
                to={`/tour-details/${similarTour.id}`}
                className="mt-4 block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300"
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

export default SimilarTours;
