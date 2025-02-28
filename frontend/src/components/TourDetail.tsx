import { motion } from "framer-motion";
import { Tour } from "../types/tours";

interface TourDetailProps {
  tour: Tour;
  handleReviewSubmit: (e: React.FormEvent) => void;
  newReview: { author: string; comment: string; rating: number };
  setNewReview: React.Dispatch<
    React.SetStateAction<{ author: string; comment: string; rating: number }>
  >;
  getInitials: (name: string) => string;
}

const TourDetail = ({
  tour,
  handleReviewSubmit,
  newReview,
  setNewReview,
  getInitials,
}: TourDetailProps) => {
  const averageRating = tour.reviews?.length
    ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
      tour.reviews.length
    : tour.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6"
    >
      <img
        src={tour.image}
        alt={tour.title}
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
          <h2 className="text-xl font-semibold text-green-800">Price</h2>
          <p className="mt-2 text-gray-600">${tour.price} per person</p>
        </motion.div>
      )}

      {tour.duration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">Duration</h2>
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
          <h2 className="text-xl font-semibold text-green-800">Gallery</h2>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {tour.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Tour Image ${index + 1}`}
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
        <h2 className="text-xl font-semibold text-green-800">Average Rating</h2>
        <p className="mt-2 text-gray-600">{averageRating.toFixed(1)} / 5</p>
      </motion.div>

      {tour.reviews?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">Reviews</h2>
          <div className="mt-2 space-y-4">
            {tour.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg flex items-start"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mr-4">
                  {getInitials(review.author)}
                </div>
                <div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    - {review.author} (Rating: {review.rating}/5)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <p className="mt-6 text-gray-600">No reviews yet.</p>
      )}

      {tour.included?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-green-800">
            What's Included
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
            What to Bring
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
          Submit Your Review
        </h2>
        <form onSubmit={handleReviewSubmit} className="mt-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your Review"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              title="Rating"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="0">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Submit Review
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TourDetail;
