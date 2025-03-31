import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NatureTours = () => {
  const [natureTours, setNatureTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
    const loadTours = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTours();
        const filteredNatureTours = data.filter(
          (tour) => tour.type === "Nature"
        );
        setNatureTours(filteredNatureTours);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setError(t("natureTours.errorMessage")); // Translated error message
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, [t]); // Add t to dependency array to re-fetch if language changes

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/nature-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-md">
            {t("natureTours.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t("natureTours.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* Tour Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold text-green-800">
          {t("natureTours.highlightsTitle")}
        </h2>
        <p className="mt-2 text-lg text-gray-700">
          {t("natureTours.highlightsSubtitle")}
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-green-800">
              {t("natureTours.scenicLandscapesTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("natureTours.scenicLandscapesDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-green-800">
              {t("natureTours.ecoTourismTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("natureTours.ecoTourismDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-green-800">
              {t("natureTours.natureRetreatsTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("natureTours.natureRetreatsDescription")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Nature Tours List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-green-800 text-center mb-8">
          {t("natureTours.ourToursTitle")}
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-lg">{t("natureTours.loadingMessage")}</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg font-semibold">
            {error}
          </div>
        ) : natureTours.length === 0 ? (
          <div className="text-center text-gray-700 text-lg font-semibold">
            {t("natureTours.noToursMessage")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {natureTours.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={tour.image}
                  alt={tour.title} // Assuming title is in the user's language or needs translation
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-800">
                    {tour.title} {/* Assuming title is fetched translated */}
                  </h3>
                  <p className="mt-2 text-gray-700 line-clamp-2">
                    {tour.description}{" "}
                    {/* Assuming description is fetched translated */}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(tour.rating)}
                      <span className="ml-2 text-gray-700 font-medium">
                        {tour.rating.toFixed(1)} (
                        {t("natureTours.reviews", {
                          count: tour.reviews.length,
                        })}
                        )
                      </span>
                    </div>
                    <span className="text-green-800 font-bold">
                      ${tour.price}
                    </span>
                  </div>
                  <Link
                    to={`/tour-details/${tour._id}`}
                    className="mt-4 block w-full px-6 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {t("natureTours.viewDetails")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NatureTours;
