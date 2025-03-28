import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";

const FeaturedDestinationsSection = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTours();
        setDestinations(data.slice(0, 9));
      } catch (error) {
        console.error(t("featuredDestinations.loadError"), error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDestinations();
  }, [t]);

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
      className="py-20 bg-gradient-to-br from-green-50 to-green-100 text-center"
    >
      <h2 className="text-4xl font-extrabold text-green-800">
        {t("featuredDestinations.title")}
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        {t("featuredDestinations.subtitle")}
      </p>
      {isLoading ? (
        <div className="mt-12 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto"></div>
          <p className="mt-2">{t("featuredDestinations.loading")}</p>
        </div>
      ) : (
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {destinations.map((destination) => (
            <motion.div
              key={destination._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={destination.image}
                alt={destination.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800">
                  {destination.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 uppercase">
                  {destination.type}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {destination.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {renderStars(destination.rating)}
                    <span className="ml-2 text-gray-700 font-medium">
                      {destination.rating.toFixed(1)} (
                      {t("featuredDestinations.reviews", {
                        count: destination.reviews.length,
                      })}
                      )
                    </span>
                  </div>
                </div>
                <Link
                  to={`/tour-details/${destination._id}`}
                  className="mt-4 block w-full px-6 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t("featuredDestinations.viewDetails")}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedDestinationsSection;
