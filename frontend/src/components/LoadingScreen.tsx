import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-geen-900 text-green-800 mb-50 z-50">
      {/* Bird flying animation */}
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: "100vw" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute text-7xl"
      >
        🐘🦣🦏🦒🐅🦛
        {/* Bird emoji to represent flying */}
      </motion.div>

      {/* Growing leaf animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <span className="text-6xl">🌱</span> {/* Leaf emoji */}
        <p className="text-lg mt-2 font-semibold">
          Connecting You with South Sudan Horizon...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
