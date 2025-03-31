import React from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Booking {
  id: string;
  title: string;
  date: string;
  price: number;
  description: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface BookingHistoryProps {
  loading: boolean;
  bookingHistory: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({
  loading,
  bookingHistory,
}) => {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <FaCalendar className="mr-2" /> {t("bookingHistory.title")}
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
            <p className="text-gray-600">
              {t("bookingHistory.dateLabel")}: {booking.date}
            </p>
            <p className="text-gray-600">
              {t("bookingHistory.priceLabel")}: ${booking.price}
            </p>
            <p className="text-gray-600">
              {t("bookingHistory.descriptionLabel")}: {booking.description}
            </p>
            <p className="text-gray-600">
              {t("bookingHistory.statusLabel")}:{" "}
              <span
                className={
                  booking.status === "confirmed"
                    ? "text-green-600"
                    : booking.status === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {t(`bookingHistory.status.${booking.status}`)}
              </span>
            </p>
            <Link to={`/booking-details/${booking.id}`}>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                {t("bookingHistory.viewDetails")}
              </button>
            </Link>
          </div>
        ))
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600">{t("bookingHistory.noBookings")}</p>
          <p className="text-gray-600 mt-2">
            {t("bookingHistory.explorePrompt")}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingHistory;
