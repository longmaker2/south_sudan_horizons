import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";

// Debounce function to delay search
const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const SearchTours = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTours = async () => {
      setIsLoading(true);
      try {
        const fetchedTours = await fetchTours();
        setTours(fetchedTours);
        setFilteredTours(fetchedTours);
      } catch (err) {
        setError(t("searchTours.error"));
        console.error("Error fetching tours:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTours();
  }, [t]);

  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      setError(null);
      const debouncedSearch = debounce(() => {
        const results = tours.filter((tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTours(results);
        setIsLoading(false);
        setShowResults(true);
      }, 300);
      debouncedSearch();
    } else {
      setFilteredTours(tours);
      setShowResults(false);
      setIsLoading(false);
    }
  }, [searchTerm, tours]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
    setHighlightedIndex(-1);
  };

  const handleSearchSubmit = () => {
    if (highlightedIndex >= 0 && filteredTours[highlightedIndex]) {
      navigate(`/tours/${filteredTours[highlightedIndex]._id}`);
      setShowResults(false);
      setSearchTerm("");
    } else if (filteredTours.length > 0) {
      navigate(`/tours/${filteredTours[0]._id}`);
      setShowResults(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredTours.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold text-green-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-6">
        {t("searchTours.title")}
      </h2>
      <div className="relative flex items-center justify-center">
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t("searchTours.placeholder")}
              className="w-full border-2 border-green-400 px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-500 transition-all duration-300 outline-none pr-20 sm:pr-24"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onKeyDown={handleKeyDown}
              aria-label={t("searchTours.searchLabel")}
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition"
                aria-label={t("searchTours.clearLabel")}
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={handleSearchSubmit}
              title={t("searchTours.searchButton")}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
              aria-label={t("searchTours.searchButton")}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg z-10 max-h-64 overflow-y-auto"
              >
                {error ? (
                  <p className="text-red-600 text-center p-4 text-sm sm:text-base">
                    {error}
                  </p>
                ) : filteredTours.length > 0 ? (
                  <ul className="space-y-1 p-2">
                    {filteredTours.map((tour, index) => (
                      <li key={tour._id}>
                        <Link
                          to={`/tour-details/${tour._id}`}
                          className={`block px-3 py-2 rounded-lg text-green-800 hover:bg-green-100 transition text-sm sm:text-base ${
                            highlightedIndex === index ? "bg-green-100" : ""
                          }`}
                          aria-selected={highlightedIndex === index}
                          onClick={() => {
                            setShowResults(false);
                            setSearchTerm("");
                          }}
                        >
                          {highlightText(tour.title, searchTerm)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-center p-4 text-sm sm:text-base">
                    {isLoading ? (
                      <FaSpinner className="animate-spin mx-auto w-5 h-5" />
                    ) : (
                      t("searchTours.noResults")
                    )}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchTours;
