import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaStar } from "react-icons/fa";
import { Tour } from "../types/tours";
import { fetchTours } from "../utils/api";
import { useTranslation } from "react-i18next";

const AllTours = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Translated categories
  const categories = [
    { value: "All", label: t("tours.allTours") },
    { value: "Adventure", label: t("tours.adventureTours") },
    { value: "Cultural", label: t("tours.culturalTours") },
    { value: "Wildlife", label: t("tours.wildlifeTours") },
    { value: "Nature", label: t("tours.natureTours") },
  ];

  useEffect(() => {
    const loadTours = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTours();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredTours(
        tours.filter((tour: Tour) => {
          const matchesType =
            selectedType === "All" || tour.type === selectedType;
          const matchesSearch = tour.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          return matchesType && matchesSearch;
        })
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [selectedType, searchQuery, tours]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
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
        style={{ backgroundImage: `url('/assets/tours/all-tours-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            {t("tours.allToursTitle")}
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            {t("tours.allToursSubtitle")}
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 px-4">
          {/* Search Box (Left) */}
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-green-600" />
            <input
              type="text"
              placeholder={t("tours.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedType(category.value)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                  selectedType === category.value
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-green-800 hover:bg-green-200 border border-green-400"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tour List */}
      <div className="py-12 px-4 max-w-6xl mx-auto min-h-[50vh] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mb-4"></div>
            <p className="text-lg font-medium">{t("tours.loadingMessage")}</p>
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-800">
                    {tour.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{tour.description}</p>
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
        ) : (
          <div className="text-center py-12 text-gray-700">
            <p className="text-xl font-semibold">{t("tours.noResultsTitle")}</p>
            <p className="mt-2 text-lg">{t("tours.noResultsSubtitle")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTours;
