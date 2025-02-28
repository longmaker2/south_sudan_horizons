import { motion } from "framer-motion";
import tours from "../assets/data/tours"; // Import the tours data

const WildlifeTours = () => {
  // Filter tours to get only Wildlife tours
  const wildlifeTours = tours.filter((tour) => tour.type === "Wildlife");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/wildlife-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            Wildlife Tours
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            Discover the incredible wildlife of South Sudan.
          </p>
        </div>
      </motion.div>

      {/* Tour Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">Tour Highlights</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              Safari Adventures
            </h3>
            <p className="text-gray-700 mt-2">
              Spot elephants, giraffes, and more in their natural habitat.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              Bird Watching
            </h3>
            <p className="text-gray-700 mt-2">
              Observe rare and exotic bird species in South Sudan's wetlands.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800">
              National Parks
            </h3>
            <p className="text-gray-700 mt-2">
              Explore Boma National Park and other wildlife reserves.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Wildlife Tours List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 text-center mb-8">
          Our Wildlife Tours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wildlifeTours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800">
                  {tour.title}
                </h3>
                <p className="text-gray-700 mt-2">{tour.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-800 font-bold">
                    ${tour.price}
                  </span>
                  <span className="text-gray-600">{tour.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WildlifeTours;
