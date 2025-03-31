import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CulturalTours = () => {
  const { t } = useTranslation();
  const [culturalTours, setCulturalTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTours = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTours();
        const filteredCulturalTours = data.filter(
          (tour) => tour.type === "Cultural"
        );
        setCulturalTours(filteredCulturalTours);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setError(t("culturalTours.errorMessage"));
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, [t]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          } text-sm`}
          fill="currentColor"
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/cultural-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            {t("culturalTours.title")}
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            {t("culturalTours.subtitle")}
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
        <h2 className="text-4xl font-bold text-green-800">
          {t("culturalTours.highlightsTitle")}
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              {t("culturalTours.communitiesTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("culturalTours.communitiesDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              {t("culturalTours.ceremoniesTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("culturalTours.ceremoniesDescription")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              {t("culturalTours.sitesTitle")}
            </h3>
            <p className="text-gray-700 mt-2">
              {t("culturalTours.sitesDescription")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cultural Tours List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
          {t("culturalTours.ourToursTitle")}
        </h2>
        {isLoading ? (
          <div className="mt-12 text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto"></div>
            <p className="mt-2">{t("culturalTours.loadingMessage")}</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg font-semibold">
            {error}
          </div>
        ) : culturalTours.length === 0 ? (
          <div className="text-center text-gray-700 text-lg font-semibold">
            {t("culturalTours.noToursMessage")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {culturalTours.map((tour) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-800">
                    {tour.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{tour.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      {renderStars(tour.rating)}
                      <span className="text-sm text-gray-600">
                        {tour.rating.toFixed(1)} ({tour.reviews.length}{" "}
                        {t("tours.reviews")})
                      </span>
                    </div>
                    <span className="text-green-800 font-bold">
                      ${tour.price}
                    </span>
                  </div>
                  <Link
                    to={`/tour-details/${tour._id}`}
                    className="mt-4 block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300"
                  >
                    {t("tours.viewDetails")}
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

export default CulturalTours;
