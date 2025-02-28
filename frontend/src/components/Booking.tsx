import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitBooking } from "../utils/api";

// Mock data for available guides
const availableGuides = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    profile: "Experienced guide with 5+ years of expertise in mountain tours.",
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Jane Smith",
    profile: "Specializes in cultural and historical tours.",
  },
  {
    id: "507f1f77bcf86cd799439013",
    name: "Alex Johnson",
    profile: "Adventure guide with a focus on extreme sports.",
  },
];

const Booking = ({ tourId }: { tourId: string }) => {
  const { user } = useAuth(); // Get the authenticated user
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [needsGuide, setNeedsGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      tourId,
      name,
      email,
      guests: Number(guests),
      date: new Date(date).toISOString(), // Convert date to ISO string
      needsGuide,
      guideId: selectedGuide || undefined,
    };

    console.log("Booking Data:", bookingData);

    try {
      const result = await submitBooking(bookingData);
      alert("Booking successful!");
      console.log("Booking result:", result);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    }
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Number of Guests"
              title="Number of Guests"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tour Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Select Tour Date"
              title="Tour Date"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you need a guide?
            </label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={() => setNeedsGuide(!needsGuide)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  needsGuide ? "bg-green-600" : "bg-gray-300"
                }`}
                title={needsGuide ? "Disable guide" : "Enable guide"}
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
                  onChange={(e) => setSelectedGuide(e.target.value)}
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
