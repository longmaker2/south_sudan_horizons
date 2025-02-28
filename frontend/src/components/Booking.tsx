import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data for available guides
const availableGuides = [
  {
    id: 1,
    name: "John Doe",
    profile: "Experienced guide with 5+ years of expertise in mountain tours.",
  },
  {
    id: 2,
    name: "Jane Smith",
    profile: "Specializes in cultural and historical tours.",
  },
  {
    id: 3,
    name: "Alex Johnson",
    profile: "Adventure guide with a focus on extreme sports.",
  },
];

const Booking = () => {
  const [needsGuide, setNeedsGuide] = useState(false); // State to track if a guide is needed
  const [selectedGuide, setSelectedGuide] = useState(""); // State to track the selected guide

  const handleGuideToggle = () => {
    setNeedsGuide(!needsGuide);
    setSelectedGuide(""); // Reset selected guide when toggling
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGuide(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="lg:col-span-1"
    >
      <div className="sticky top-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-800">Book This Tour</h2>
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Number of Guests"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tour Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              title="Tour Date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you need a guide?
            </label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={handleGuideToggle}
                title="Toggle guide requirement"
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  needsGuide ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    needsGuide ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </button>
              <span className="ml-2 text-sm text-gray-600">
                {needsGuide ? "Yes" : "No"}
              </span>
            </div>
          </div>
          {needsGuide && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select a Guide
              </label>
              <div className="flex items-center gap-2">
                <select
                  title="Select a guide"
                  value={selectedGuide}
                  onChange={handleGuideChange}
                  className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a guide</option>
                  {availableGuides.map((guide) => (
                    <option key={guide.id} value={guide.id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
                {selectedGuide && (
                  <Link
                    to={`/guides/${selectedGuide}`}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Book Now
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Booking;
