import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallToActionSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-white text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">
        Ready to Explore South Sudan?
      </h2>
      <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
        Book your adventure today and experience the beauty of South Sudan.
      </p>
      <div className="mt-6">
        <Link
          to="/tours/all"
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );
};

export default CallToActionSection;
