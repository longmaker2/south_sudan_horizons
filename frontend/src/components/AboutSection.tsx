import { motion } from "framer-motion";
import { FaTree, FaMountain, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FunFactSection from "./FunFactSection";

const AboutSection = () => {
  const { t } = useTranslation();

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
        {t("aboutsection.title")}
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        {t("aboutsection.description")}
      </p>

      {/* Key Highlights Section */}
      <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Natural Beauty */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaMountain />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            {t("aboutsection.features.naturalBeauty.title")}
          </h3>
          <p className="mt-2 text-gray-700">
            {t("aboutsection.features.naturalBeauty.description")}
          </p>
        </div>

        {/* Wildlife */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaTree />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            {t("aboutsection.features.wildlife.title")}
          </h3>
          <p className="mt-2 text-gray-700">
            {t("aboutsection.features.wildlife.description")}
          </p>
        </div>

        {/* Cultural Diversity */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-green-600 text-5xl">
            <FaUsers />
          </div>
          <h3 className="mt-4 text-xl font-bold text-green-800">
            {t("aboutsection.features.culture.title")}
          </h3>
          <p className="mt-2 text-gray-700">
            {t("aboutsection.features.culture.description")}
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <Link
          to="/tours/all"
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
        >
          {t("aboutsection.cta")}
        </Link>
      </div>

      {/* Fun Facts Section */}
      <FunFactSection />
    </motion.div>
  );
};

export default AboutSection;
