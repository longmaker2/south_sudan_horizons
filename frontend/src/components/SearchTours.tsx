import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Sample Tours Data (Will be replaced with API call)
const toursData = [
  {
    id: 1,
    title: "Wildlife Safari in Boma Park",
    slug: "wildlife-safari-boma",
  },
  { id: 2, title: "Cultural Tour in Juba", slug: "cultural-tour-juba" },
  { id: 3, title: "Nile River Expedition", slug: "nile-river-expedition" },
  { id: 4, title: "Mount Kinyeti Adventure", slug: "mount-kinyeti-adventure" },
  {
    id: 5,
    title: "Traditional Dinka Village Experience",
    slug: "dinka-village-tour",
  },
];

// Debounce function to delay search
const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const SearchTours = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call with debounce
  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      setError(null);
      const debouncedSearch = debounce(() => {
        setIsLoading(false);
        // Simulate an error for demonstration
        if (searchTerm.toLowerCase() === "error") {
          setError("Failed to fetch results. Please try again.");
        }
      }, 300); // 300ms debounce delay
      debouncedSearch();
    } else {
      setIsLoading(false);
    }
  }, [searchTerm]);

  // Filter tours based on search term
  const filteredTours = toursData.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
    setHighlightedIndex(-1);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredTours.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      window.location.href = `/tours/${filteredTours[highlightedIndex].slug}`;
    }
  };

  // Highlight matching text in results
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
      <h2 className="text-3xl font-bold text-green-800 text-center mb-6">
        Search Popular Tours
      </h2>
      <div className="flex items-center justify-center relative">
        <div className="relative w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tours..."
              className="w-full border-2 border-green-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-500 transition-all duration-300 outline-none pr-12"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onKeyDown={handleKeyDown}
              aria-label="Search tours"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-14 top-3 text-green-600 hover:text-green-800 transition"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
            <button
              title="Search"
              className="absolute right-2 top-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
              aria-label="Search"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSearch />
              )}
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full max-w-lg bg-white shadow-lg rounded-lg z-10"
            >
              {error ? (
                <p className="text-red-600 text-center p-4">{error}</p>
              ) : filteredTours.length > 0 ? (
                <ul className="space-y-2 p-3 max-h-64 overflow-y-auto">
                  {filteredTours.map((tour, index) => (
                    <li key={tour.id}>
                      <Link
                        to={`/tours/${tour.slug}`}
                        className={`block px-4 py-3 rounded-lg text-green-800 hover:bg-green-100 transition ${
                          highlightedIndex === index ? "bg-green-100" : ""
                        }`}
                        aria-selected={highlightedIndex === index}
                      >
                        {highlightText(tour.title, searchTerm)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center p-4">
                  {isLoading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    "No tours found."
                  )}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchTours;
