import { motion } from "framer-motion";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface TourDetailProps {
  tour: Tour;
  handleReviewSubmit: (e: React.FormEvent) => void;
  newReview: { author: string; comment: string; rating: number };
  setNewReview: React.Dispatch<
    React.SetStateAction<{ author: string; comment: string; rating: number }>
  >;
  getInitials: (name: string) => string;
  reviewError: string | null;
  reviewSuccess: string | null;
}

const TourDetail = ({
  tour,
  handleReviewSubmit,
  newReview,
  setNewReview,
  getInitials,
  reviewError,
  reviewSuccess,
}: TourDetailProps) => {
  const { t } = useTranslation(); // Hook to access translations

  const averageRating = tour.reviews?.length
    ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
      tour.reviews.length
    : tour.rating || 0;

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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6"
    >
      <img
        src={tour.image}
        alt={t("tourDetail.imageAlt", { title: tour.title })}
        className="w-full h-64 object-cover rounded-lg"
        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
      />
      <h1 className="text-3xl font-bold text-green-800 mt-6">{tour.title}</h1>
      <p className="mt-4 text-gray-600">{tour.description}</p>

      {tour.price && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.priceTitle")}
          </h2>
          <p className="mt-2 text-gray-600">
            {t("tourDetail.price", { price: tour.price })}
          </p>
        </motion.div>
      )}

      {tour.duration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.durationTitle")}
          </h2>
          <p className="mt-2 text-gray-600">{tour.duration}</p>
        </motion.div>
      )}

      {tour.gallery?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.galleryTitle")}
          </h2>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {tour.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={t("tourDetail.galleryImageAlt", { index: index + 1 })}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="mt-6"
      >
        <h2 className="text-xl font-semibold text-green-800">
          {t("tourDetail.averageRatingTitle")}
        </h2>
        <div className="flex items-center mt-2">
          {renderStars(averageRating)}
          <p className="ml-2 text-gray-600">{averageRating.toFixed(1)} / 5</p>
        </div>
      </motion.div>

      {tour.reviews?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.reviewsTitle")}
          </h2>
          <div className="mt-2 space-y-4">
            {tour.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg flex items-start shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mr-4">
                  {getInitials(review.author)}
                </div>
                <div>
                  <p className="text-gray-600">{review.comment}</p>
                  <div className="flex items-center mt-2">
                    {renderStars(review.rating)}
                    <p className="ml-2 text-sm text-gray-500">
                      - {review.author} ({review.rating}/5)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <p className="mt-6 text-gray-600">{t("tourDetail.noReviews")}</p>
      )}

      {tour.included?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.includedTitle")}
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            {tour.included.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ) : null}

      {tour.toBring?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            {t("tourDetail.toBringTitle")}
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            {tour.toBring.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        className="mt-6"
      >
        <h2 className="text-xl font-semibold text-green-800">
          {t("tourDetail.submitReviewTitle")}
        </h2>
        <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tourDetail.nameLabel")}
            </label>
            <input
              type="text"
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              readOnly
              title={t("tourDetail.nameTitle")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tourDetail.reviewLabel")}
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              placeholder={t("tourDetail.reviewPlaceholder")}
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("tourDetail.ratingLabel")}
            </label>
            <select
              title={t("tourDetail.ratingTitle")}
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
              required
            >
              <option value="0">{t("tourDetail.selectRating")}</option>
              <option value="1">{t("tourDetail.rating1")}</option>
              <option value="2">{t("tourDetail.rating2")}</option>
              <option value="3">{t("tourDetail.rating3")}</option>
              <option value="4">{t("tourDetail.rating4")}</option>
              <option value="5">{t("tourDetail.rating5")}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-small px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {t("tourDetail.submitButton")}
          </button>
        </form>
        {reviewSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 bg-green-50 p-4 rounded-lg text-center text-green-800 text-lg font-semibold shadow-sm"
          >
            {reviewSuccess}
          </motion.div>
        )}
        {reviewError && (
          <p className="mt-4 text-red-500 text-center text-lg font-semibold bg-red-50 p-4 rounded-lg">
            {reviewError}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TourDetail;
