import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      icon: "🌍",
      title: t("services.guidedTours.title"),
      description: t("services.guidedTours.description"),
    },
    {
      id: 2,
      icon: "🏕️",
      title: t("services.adventureCamping.title"),
      description: t("services.adventureCamping.description"),
    },
    {
      id: 3,
      icon: "📸",
      title: t("services.photographyTours.title"),
      description: t("services.photographyTours.description"),
    },
    {
      id: 4,
      icon: "🛶",
      title: t("services.boatSafaris.title"),
      description: t("services.boatSafaris.description"),
    },
    {
      id: 5,
      icon: "🐘",
      title: t("services.wildlifeSafaris.title"),
      description: t("services.wildlifeSafaris.description"),
    },
    {
      id: 6,
      icon: "🎭",
      title: t("services.culturalExperiences.title"),
      description: t("services.culturalExperiences.description"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, ...(window.innerWidth < 640 ? {} : { y: 40 }) }}
      whileInView={{ opacity: 1, ...(window.innerWidth < 640 ? {} : { y: 0 }) }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-16 sm:py-20 bg-white text-center overflow-hidden"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-green-800">
        {t("services.title")}
      </h2>
      <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-4xl mx-auto">
        {t("services.subtitle")}
      </p>
      <div className="mt-6 sm:mt-8 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 px-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[200px]"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-green-800">
              {service.title}
            </h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base flex-grow">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicesSection;
