import { motion } from "framer-motion";
import gallery1 from "../assets/tour_pics/badingilo.webp";
import gallery2 from "../assets/tour_pics/boma.webp";
import gallery3 from "../assets/tour_pics/nimule.webp";
import gallery4 from "../assets/tour_pics/cultural_delights_Juba.webp";
import gallery5 from "../assets/tour_pics/white_nile.webp";
import gallery6 from "../assets/tour_pics/juba_markets.webp";

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
];

const Gallery = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-20 bg-white text-center"
    >
      <h2 className="text-4xl font-bold text-green-800">Photo Gallery</h2>
      <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
        Explore the beauty of South Sudan through breathtaking visuals.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-4">
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Gallery;
