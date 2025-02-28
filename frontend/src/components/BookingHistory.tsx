import React from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaSpinner } from "react-icons/fa";

interface Booking {
  id: number;
  title: string;
  date: string;
  price: number;
  description: string;
}

interface BookingHistoryProps {
  loading: boolean;
  bookingHistory: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({
  loading,
  bookingHistory,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <FaCalendar className="mr-2" /> Booking History
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <FaSpinner className="animate-spin h-8 w-8 text-green-600" />
        </div>
      ) : bookingHistory.length > 0 ? (
        bookingHistory.map((booking) => (
          <div
            key={booking.id}
            className="py-2 border-b hover:bg-gray-50 transition-all duration-300"
          >
            <p className="font-semibold">{booking.title}</p>
            <p className="text-gray-600">Date: {booking.date}</p>
            <p className="text-gray-600">Price: ${booking.price}</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
              View Details
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600">No bookings found.</p>
          <p className="text-gray-600 mt-2">
            Explore our tours and book your next adventure!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingHistory;
