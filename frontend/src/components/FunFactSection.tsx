import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  {
    text: "South Sudan is home to the Sudd, one of the largest wetlands in the world.",
    icon: "🌍",
    bgColor: "bg-green-100",
  },
  {
    text: "Boma National Park is larger than some entire countries!",
    icon: "🐘",
    bgColor: "bg-blue-100",
  },
  {
    text: "South Sudan has over 60 different ethnic groups with rich cultural traditions.",
    icon: "🎭",
    bgColor: "bg-yellow-100",
  },
  {
    text: "South Sudan is the youngest country in the world, gaining independence on July 9, 2011.",
    icon: "🎉",
    bgColor: "bg-red-100",
  },
  {
    text: "The White Nile, one of the two main tributaries of the Nile River, flows through South Sudan.",
    icon: "🌊",
    bgColor: "bg-blue-100",
  },
  {
    text: "South Sudan is home to the second-largest animal migration in the world, after the Serengeti.",
    icon: "🦒",
    bgColor: "bg-yellow-100",
  },
  {
    text: "Octopuses have three hearts, and two of them stop beating when they swim.",
    icon: "🐙",
    bgColor: "bg-pink-100",
  },
  {
    text: "Bananas are berries, but strawberries aren't!",
    icon: "🍌",
    bgColor: "bg-yellow-100",
  },
  {
    text: "The Eiffel Tower can grow taller by up to 6 inches during summer due to thermal expansion.",
    icon: "🗼",
    bgColor: "bg-blue-100",
  },
  {
    text: "Honey never spoils. Archaeologists have found 3,000-year-old honey in ancient Egyptian tombs that's still edible!",
    icon: "🍯",
    bgColor: "bg-orange-100",
  },
];

const FunFactSection = () => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 5000); // Change fact every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
      className="py-12 bg-gray-100 text-center"
    >
      <div className="relative max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={`${facts[factIndex].bgColor} px-6 py-4 rounded-lg shadow-lg`}
          >
            <div className="text-lg font-medium text-green-800">
              <span className="text-2xl">{facts[factIndex].icon}</span> Fun
              Fact: {facts[factIndex].text}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
          <button
            onClick={handlePrevFact}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            aria-label="Previous fact"
          >
            ←
          </button>
          <button
            onClick={handleNextFact}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            aria-label="Next fact"
          >
            →
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {facts.map((_, index) => (
          <button
            key={index}
            onClick={() => setFactIndex(index)}
            className={`w-3 h-3 rounded-full ${
              factIndex === index ? "bg-green-600" : "bg-gray-400"
            }`}
            aria-label={`Go to fact ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FunFactSection;
