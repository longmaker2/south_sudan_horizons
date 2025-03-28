import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const FunFactSection = () => {
  const { t } = useTranslation();
  const [factIndex, setFactIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const facts = [
    {
      text: t("funFacts.suddWetland"),
      icon: "🌍",
      bgColor: "bg-green-100",
    },
    {
      text: t("funFacts.bomaPark"),
      icon: "🐘",
      bgColor: "bg-blue-100",
    },
    {
      text: t("funFacts.ethnicGroups"),
      icon: "🎭",
      bgColor: "bg-yellow-100",
    },
    {
      text: t("funFacts.independence"),
      icon: "🎉",
      bgColor: "bg-red-100",
    },
    {
      text: t("funFacts.whiteNile"),
      icon: "🌊",
      bgColor: "bg-blue-100",
    },
    {
      text: t("funFacts.animalMigration"),
      icon: "🦒",
      bgColor: "bg-yellow-100",
    },
  ];

  // Update isLargeScreen on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide only on large screens
  useEffect(() => {
    if (isLargeScreen) {
      const interval = setInterval(() => {
        setFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLargeScreen, facts.length]);

  const handleNextFact = () => {
    setFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
  };

  const handlePrevFact = () => {
    setFactIndex((prevIndex) =>
      prevIndex === 0 ? facts.length - 1 : prevIndex - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-10 sm:py-12 bg-gray-100 text-center overflow-hidden"
    >
      <div className="max-w-md sm:max-w-lg md:max-w-6xl mx-auto relative">
        {isLargeScreen ? (
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={factIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`${facts[factIndex].bgColor} px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg`}
              >
                <div className="text-base sm:text-lg font-medium text-green-800 flex items-center justify-center space-x-2">
                  <span className="text-xl sm:text-2xl">
                    {facts[factIndex].icon}
                  </span>
                  <span className="text-center">
                    {t("funFacts.label")}: {facts[factIndex].text}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 flex justify-between w-full px-2 sm:px-4 md:flex hidden">
              <button
                onClick={handlePrevFact}
                className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition self-center"
                aria-label={t("funFacts.prevButton")}
              >
                ←
              </button>
              <button
                onClick={handleNextFact}
                className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition self-center"
                aria-label={t("funFacts.nextButton")}
              >
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {facts.map((fact, index) => (
              <div
                key={index}
                className={`${fact.bgColor} px-4 py-3 rounded-lg shadow-md`}
              >
                <div className="text-base font-medium text-green-800 flex items-center justify-center space-x-2">
                  <span className="text-xl">{fact.icon}</span>
                  <span className="text-center">
                    {t("funFacts.label")}: {fact.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Dots (visible only on large screens) */}
      {isLargeScreen && (
        <div className="flex justify-center mt-4 space-x-2">
          {facts.map((_, index) => (
            <button
              key={index}
              onClick={() => setFactIndex(index)}
              className={`w-3 h-3 rounded-full ${
                factIndex === index ? "bg-green-600" : "bg-gray-400"
              }`}
              aria-label={`${t("funFacts.goToFact")} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FunFactSection;
