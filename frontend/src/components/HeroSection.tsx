import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroImage from "../assets/hero-section.webp";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-cover bg-center px-4 py-12 text-center text-white sm:px-6 md:py-20"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-40"></div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="rounded-xl bg-green-800 bg-opacity-20 p-6 backdrop-blur-sm sm:p-8 md:p-10">
          <h1 className="mb-4 font-extrabold drop-shadow-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-gray-100 sm:text-lg md:max-w-2xl md:text-xl lg:max-w-3xl">
            {t("hero.subtitle")}
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              to="/tours/all"
              className="w-full rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto sm:text-lg"
            >
              {t("hero.exploreTours")}
            </Link>
            <Link
              to="/guides"
              className="w-full rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto sm:text-lg"
            >
              {t("hero.meetGuides")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
