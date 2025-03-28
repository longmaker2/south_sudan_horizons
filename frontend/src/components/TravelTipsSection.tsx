import { motion } from "framer-motion";
import travelTipsImage from "../assets/travelling_tips/Travel-Tips1.webp";
import travelTipsImage2 from "../assets/travelling_tips/safetyfirst-1.webp";
import travelTipsImage3 from "../assets/travelling_tips/tip1.jpg";
import { useTranslation } from "react-i18next";

const TravelTipsSection = () => {
  const { t } = useTranslation();

  const travelTips = [
    {
      id: 1,
      title: t("travelTips.tip1.title"),
      image: travelTipsImage,
      description: t("travelTips.tip1.description"),
    },
    {
      id: 2,
      title: t("travelTips.tip2.title"),
      image: travelTipsImage2,
      description: t("travelTips.tip2.description"),
    },
    {
      id: 3,
      title: t("travelTips.tip3.title"),
      image: travelTipsImage3,
      description: t("travelTips.tip3.description"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-green-50 text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">
        {t("travelTips.title")}
      </h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        {t("travelTips.subtitle")}
      </p>
      <div className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {travelTips.map((tip) => (
          <div key={tip.id} className="bg-white p-6 rounded-lg shadow-md">
            <img
              src={tip.image}
              alt={tip.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-bold text-green-800">
              {tip.title}
            </h3>
            <p className="mt-2 text-gray-700">{tip.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TravelTipsSection;
