import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTours } from "../utils/api";
import { Tour } from "../types/tours";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdventureTours = () => {
  const [adventureTours, setAdventureTours] = useState<Tour[]>([]);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const data = await fetchTours();
        const filteredAdventureTours = data.filter(
          (tour) => tour.type === "Adventure"
        );
        setAdventureTours(filteredAdventureTours);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      }
    };
    loadTours();
  }, []);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          } text-sm`}
          fill="currentColor"
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/adventure-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            Adventure Tours
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            Embark on thrilling adventures across South Sudan's stunning
            landscapes.
          </p>
        </div>
      </motion.div>

      {/* Tour Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">Tour Highlights</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              Hiking & Trekking
            </h3>
            <p className="text-gray-700 mt-2">
              Explore the rugged terrains and breathtaking views of South
              Sudan's mountains.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              River Rafting
            </h3>
            <p className="text-gray-700 mt-2">
              Experience the thrill of rafting on the White Nile.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              Desert Safaris
            </h3>
            <p className="text-gray-700 mt-2">
              Discover the beauty of South Sudan's deserts and oases.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Adventure Tours List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
          Our Adventure Tours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventureTours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800">
                  {tour.title}
                </h3>
                <p className="text-gray-700 mt-2">{tour.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    {renderStars(tour.rating)}
                    <span className="text-sm text-gray-600">
                      ({tour.rating})
                    </span>
                  </div>
                  <span className="text-green-800 font-bold">
                    ${tour.price}
                  </span>
                </div>
                <Link
                  to={`/tour-details/${tour.id}`}
                  className="mt-4 block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdventureTours;
