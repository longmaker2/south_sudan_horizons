import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    icon: "🌍",
    title: "Guided Tours",
    description:
      "Explore South Sudan with our expert guides who will take you to the most breathtaking locations.",
  },
  {
    id: 2,
    icon: "🏕️",
    title: "Adventure Camping",
    description:
      "Experience the thrill of camping in the wild with our fully equipped adventure camping packages.",
  },
  {
    id: 3,
    icon: "📸",
    title: "Photography Tours",
    description:
      "Capture the beauty of South Sudan with our photography-focused tours designed for enthusiasts.",
  },
  {
    id: 4,
    icon: "🛶",
    title: "Boat Safaris",
    description:
      "Discover the Sudd wetlands and its rich biodiversity with our guided boat safaris.",
  },
  {
    id: 5,
    icon: "🐘",
    title: "Wildlife Safaris",
    description:
      "Get up close with South Sudan's diverse wildlife in its natural habitat.",
  },
  {
    id: 6,
    icon: "🎭",
    title: "Cultural Experiences",
    description:
      "Immerse yourself in the vibrant traditions and cultures of South Sudan's ethnic groups.",
  },
];

const ServicesSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, ...(window.innerWidth < 640 ? {} : { y: 40 }) }}
      whileInView={{ opacity: 1, ...(window.innerWidth < 640 ? {} : { y: 0 }) }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-16 sm:py-20 bg-white text-center overflow-hidden"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-green-800">
        Our Services
      </h2>
      <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-4xl mx-auto">
        We offer a wide range of services to make your South Sudan adventure
        unforgettable.
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
