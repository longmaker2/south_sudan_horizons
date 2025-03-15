import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchGuideBookings, updateBookingStatus } from "../utils/api";
import { Booking } from "../types/bookings";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import mongoose from "mongoose";

const GuideDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    console.log("User data from Auth context:", user);
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token used for fetchGuideBookings:", token);
        if (!token) {
          setError("No authentication token found. Please log in.");
          console.error("No token found in localStorage");
          return;
        }

        if (!user) {
          setError("User data not available. Please log in again.");
          console.error("User object is null or undefined");
          return;
        }

        if (user.role !== "guide") {
          console.log(`User role is '${user.role}', expected 'guide'`);
          setError("You must be a guide to view this dashboard.");
          return;
        }

        // Decode token for debugging and validation
        let decoded;
        try {
          decoded = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded token payload in GuideDashboard:", decoded);
          if (!decoded.id) {
            setError("Token missing user ID. Please log in again.");
            console.error("Token payload missing 'id' field");
            return;
          }
          if (decoded.role !== "guide") {
            setError("You must be a guide to view this dashboard.");
            console.error(`Token role is '${decoded.role}', expected 'guide'`);
            return;
          }
        } catch (e) {
          console.error("Failed to decode token in GuideDashboard:", e);
          setError("Invalid token format. Please log in again.");
          return;
        }

        console.log("Fetching guide bookings for user:", user);
        const guideBookings = await fetchGuideBookings();
        console.log("Fetched bookings:", guideBookings);
        setBookings(guideBookings);
      } catch (err: unknown) {
        console.error("Error fetching bookings:", err);
        if (err instanceof Error) {
          switch (err.message) {
            case "Session expired. Please log in again.":
              setError("Your session has expired. Please log in again.");
              localStorage.removeItem("token");
              break;
            case "Invalid token: Missing user ID":
            case "Invalid token: Missing or invalid guide ID":
              setError("Invalid authentication token. Please log in again.");
              localStorage.removeItem("token");
              break;
            case "Access denied: Guides only":
              setError(
                "Access denied. You must be a guide to view this dashboard."
              );
              break;
            case "Invalid token format. Please log in again.":
              setError(err.message);
              localStorage.removeItem("token");
              break;
            default:
              setError(
                err.message || "Failed to fetch bookings. Please try again."
              );
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        console.error("Invalid booking ID format:", bookingId);
        throw new Error("Invalid booking ID format");
      }
      console.log(`Updating booking ${bookingId} to ${newStatus}`);
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      setSuccessMessage(`Booking ${newStatus} successfully!`);
      setError("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: unknown) {
      console.error("Error updating booking status:", err);
      if (err instanceof Error) {
        switch (err.message) {
          case "Session expired. Please log in again.":
            setError("Your session has expired. Please log in again.");
            localStorage.removeItem("token");
            break;
          case "Access denied: Guides only":
            setError("Access denied. You must be a guide to update bookings.");
            break;
          case "Invalid booking ID format":
            setError("Invalid booking ID. Please try again.");
            break;
          default:
            setError(
              err.message ||
                "Failed to update booking status. Please try again."
            );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <Link
            to={error.includes("log in") ? "/login" : "/"}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" />{" "}
            {error.includes("log in") ? "Log In" : "Back to Home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 mt-16"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800 flex items-center">
            <FaClipboardCheck className="mr-2 text-green-600" />
            Guide Dashboard
          </h1>
          <Link
            to="/"
            className="flex items-center text-green-600 hover:text-green-700 font-medium text-lg transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 p-6 bg-green-50 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-green-800">
            Welcome, {user?.fullName || "Guide"}!
          </h2>
          <p className="text-green-700 mt-2">
            Here are the bookings assigned to you. Manage them with ease.
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-green-100 p-4 rounded-lg text-green-800 text-center font-semibold"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Bookings Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            Your Assigned Bookings
          </h2>
          {bookings.length > 0 ? (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {booking.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-700 flex items-center">
                      <FaCalendarAlt className="mr-2 text-green-600" />
                      <strong className="font-medium text-gray-900">
                        Date:
                      </strong>{" "}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <FaUsers className="mr-2 text-green-600" />
                      <strong className="font-medium text-gray-900">
                        Guests:
                      </strong>{" "}
                      {booking.guests}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <strong className="font-medium text-gray-900">
                        Booked by:
                      </strong>{" "}
                      {booking.name} ({booking.email})
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <strong className="font-medium text-gray-900">
                        Status:
                      </strong>{" "}
                      <span
                        className={`inline-block px-3 py-1 ml-2 rounded-full text-sm font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
                  {/* Action Buttons for Pending Bookings */}
                  {booking.status === "pending" && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 text-center p-6 bg-gray-50 rounded-lg shadow-sm"
            >
              No bookings assigned yet. Check back later!
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GuideDashboard;
