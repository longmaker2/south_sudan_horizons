import { motion } from "framer-motion";

const InteractiveMapSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-12 sm:py-20 bg-white text-center"
    >
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-green-800">
        Explore South Sudan
      </h2>

      {/* Description */}
      <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-4xl mx-auto px-4">
        Discover the key destinations and attractions of South Sudan on our
        interactive map.
      </p>

      {/* Map Container */}
      <div className="mt-6 sm:mt-8 max-w-6xl mx-auto px-4">
        <div className="mt-4 sm:mt-6 w-full h-60 sm:h-80 rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345096193!2d32.57609971566952!3d4.8516500424829905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x173c5f0e10aa80f3%3A0x5b33f54d3f3b52b8!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2s!4v1633208824887!5m2!1sen!2s"
            allowFullScreen
            title="South Sudan Map"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMapSection;
