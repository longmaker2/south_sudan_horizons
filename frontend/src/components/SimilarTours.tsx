import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";

interface SimilarToursProps {
  similarTours: Tour[];
}

const SimilarTours = ({ similarTours }: SimilarToursProps) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 0.5 }}
      className="mt-12 py-8 bg-gray-50 rounded-xl"
    >
      <h2 className="text-3xl font-extrabold text-green-800 text-center mb-6">
        Explore Similar Tours
      </h2>
      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-8">
        Check out more adventures like this one in South Sudan.
      </p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {similarTours.length > 0 ? (
          similarTours.map((similarTour, index) => (
            <motion.div
              key={similarTour._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={similarTour.image}
                alt={similarTour.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800">
                  {similarTour.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 uppercase">
                  {similarTour.type}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {similarTour.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {renderStars(similarTour.rating)}
                    <span className="ml-2 text-gray-700 font-medium">
                      {similarTour.rating.toFixed(1)} (
                      {similarTour.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/tour-details/${similarTour._id}`}
                  className="mt-4 block w-full px-6 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-700 text-lg font-semibold">
            No similar tours available at this time.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SimilarTours;
