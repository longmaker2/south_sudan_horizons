import { motion } from "framer-motion";
import { FaTree, FaMountain, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import FunFactSection from "./FunFactSection";

const AboutSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-gray-100 text-center"
    >
      {/* Title */}
      <h2 className="text-4xl font-bold text-green-800">
        Why Visit South Sudan?
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        South Sudan is a land of rich cultural diversity, breathtaking
        landscapes, and hidden treasures waiting to be explored. Whether you're
        seeking adventure, wildlife, or cultural immersion, this destination has
        something for everyone.
      </p>

      {/* Key Highlights Section */}
      <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Natural Beauty */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaMountain />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            Untouched Natural Beauty
          </h3>
          <p className="mt-2 text-gray-700">
            Explore stunning landscapes, from lush wetlands to towering
            mountains and vast savannas.
          </p>
        </div>

        {/* Wildlife */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaTree />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            Rich Wildlife
          </h3>
          <p className="mt-2 text-gray-700">
            Home to Africa's second-largest migration, featuring elephants,
            antelopes, and rare bird species.
          </p>
        </div>

        {/* Cultural Diversity */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaUsers />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            Diverse Cultures
          </h3>
          <p className="mt-2 text-gray-700">
            Experience 60+ ethnic groups, each with unique traditions, dances,
            and festivals.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <Link
          to="/tours/all" //
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
        >
          Explore Tours
        </Link>
      </div>

      {/* Fun Facts Section */}
      <FunFactSection />
    </motion.div>
  );
};

export default AboutSection;
