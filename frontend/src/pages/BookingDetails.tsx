import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchBookingById, updateBooking, cancelBooking } from "../utils/api";
import { Booking } from "../types/bookings";
import { FaArrowLeft } from "react-icons/fa";

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedGuests, setEditedGuests] = useState<number>(1);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await fetchBookingById(id!);
        setBooking(data);
        setEditedDate(new Date(data.date).toISOString().split("T")[0]);
        setEditedGuests(data.guests);
      } catch {
        setError("Failed to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelBooking(id!);
      setBooking({ ...booking!, status: "cancelled" });
      setSuccessMessage("Your booking has been successfully cancelled.");
      setShowCancelConfirm(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setError("Failed to cancel booking. Please try again.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBooking(id!, {
        date: editedDate,
        guests: editedGuests,
      });
      const updatedBooking = await fetchBookingById(id!);
      setBooking(updatedBooking);
      setIsEditing(false);
      setSuccessMessage("Your booking has been successfully updated.");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setError("Failed to update booking. Please try again.");
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

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-lg font-semibold">
            {error || "Booking not found."}
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
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
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 relative">
        {/* Back Link */}
        <Link
          to="/profile"
          className="flex items-center text-green-600 hover:text-green-700 font-medium text-lg mb-6 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-bold text-green-800 mb-8 border-b pb-4">
          Booking Details
        </h1>

        {/* Booking Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {booking.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Date:</strong>{" "}
              {new Date(booking.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Guests:</strong>{" "}
              {booking.guests}
            </p>
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Price:</strong> $
              {booking.price}
            </p>
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Guide:</strong>{" "}
              {booking.guideName || "No guide"}
            </p>
            <p className="text-gray-700 sm:col-span-2">
              <strong className="font-medium text-gray-900">
                Description:
              </strong>{" "}
              {booking.description}
            </p>
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Status:</strong>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
        </div>

        {/* Action Buttons */}
        {booking.status === "pending" && (
          <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isEditing ? "Cancel Edit" : "Edit Booking"}
            </button>
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel Booking
            </button>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleEditSubmit}
            className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Date
              </label>
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                required
                placeholder="Select tour date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                value={editedGuests}
                onChange={(e) => setEditedGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                min="1"
                required
                placeholder="Enter number of guests"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-green-50 p-4 rounded-lg text-center text-green-800 text-lg font-semibold shadow-sm"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-6 text-red-500 text-center text-lg font-semibold bg-red-50 p-4 rounded-lg">
            {error}
          </p>
        )}

        {/* Cancel Confirmation */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Cancellation
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={confirmCancel}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Yes, Cancel Booking
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  No, Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookingDetails;
