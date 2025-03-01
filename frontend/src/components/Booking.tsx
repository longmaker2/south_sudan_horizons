import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log("Authenticated User:", user);

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [needsGuide, setNeedsGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  interface BookingSummary {
    tourId: string;
    name: string;
    email: string;
    guests: number;
    date: string;
    needsGuide: boolean;
    guide: string | undefined;
  }

  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(
    null
  );

  // Reset success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setBookingSummary(null);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!tourId) {
      setError("Tour ID is missing. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!user?.id) {
      setError("User is not authenticated. Please log in.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      setError("Please select a future date for the tour.");
      setIsLoading(false);
      return;
    }

    const bookingData = {
      tourId,
      userId: user.id,
      name,
      email,
      guests: Number(guests),
      date: selectedDate.toISOString(),
      needsGuide,
      guideId: selectedGuide || undefined,
    };

    console.log("Booking Data:", bookingData);

    try {
      const result = await submitBooking(bookingData);
      // Update booking summary and show success message
      setBookingSummary({
        tourId,
        name,
        email,
        guests,
        date: selectedDate.toLocaleDateString(),
        needsGuide,
        guide: selectedGuide
          ? availableGuides.find((g) => g.id === selectedGuide)?.name
          : "None",
      });
      setShowSuccess(true);
      console.log("Booking result:", result);
    } catch (error) {
      console.error("Error submitting booking:", error);
      if (
        (error as Error).message === "Session expired. Please log in again."
      ) {
        navigate("/login");
      }
      setError("Failed to submit booking. Please try again.");
    } finally {
      setIsLoading(false);
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400"
          >
            {isLoading ? "Booking..." : "Book Now"}
          </button>
        </form>

        {/* Success Message and Summary */}
        {showSuccess && bookingSummary && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-green-800">
              Booking Successful!
            </h3>
            <p className="text-sm text-gray-700 mt-2">Booking Summary:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Name: {bookingSummary.name}</li>
              <li>Email: {bookingSummary.email}</li>
              <li>Guests: {bookingSummary.guests}</li>
              <li>Date: {bookingSummary.date}</li>
              <li>
                Guide:{" "}
                {bookingSummary.needsGuide ? bookingSummary.guide : "No guide"}
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Booking;
