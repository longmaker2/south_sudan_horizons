import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroImage from "../assets/hero-section.webp";

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center h-[80vh] text-center px-6 bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <div className="absolute inset-0 bg-opacity-50"></div>
      <div className="relative z-10 bg-green-800 bg-opacity-10 p-6 rounded-lg">
        <h1 className="text-6xl font-extrabold drop-shadow-lg">
          Discover South Sudan
        </h1>
        <p className="mt-4 text-xl max-w-3xl text-gray-200">
          Experience the vibrant culture, breathtaking landscapes, and unique
          adventures in the heart of Africa.
        </p>
        <div className="mt-6 flex space-x-4 justify-center">
          <Link
            to="/tours/all"
            className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore Tours
          </Link>
          <Link
            to="/guides"
            className="px-6 py-3 border border-white text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Meet Guides
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
