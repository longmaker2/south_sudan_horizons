import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

// Sample Testimonials Data
const testimonialsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "USA",
    text: "An unforgettable experience! The landscapes are breathtaking, and the people are incredibly welcoming.",
  },
  {
    id: 2,
    name: "John Smith",
    country: "UK",
    text: "South Sudan is a hidden gem. The cultural tours were eye-opening, and the guides were very knowledgeable.",
  },
  {
    id: 3,
    name: "Maria Lopez",
    country: "Spain",
    text: "The wildlife safari was beyond expectations. I got to see elephants, giraffes, and even rare birds!",
  },
  {
    id: 4,
    name: "James Deng",
    country: "South Sudan",
    text: "As a local, I was proud to show my friends around. The service and hospitality were world-class.",
  },
  {
    id: 5,
    name: "Emily Carter",
    country: "Canada",
    text: "A truly immersive experience! Learning about the cultures and traditions was the highlight of my trip.",
  },
  {
    id: 6,
    name: "David Kim",
    country: "South Korea",
    text: "Loved the boat safari in the Sudd wetlands! It was peaceful and beautiful beyond words.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const testimonialsPerPage = 3;

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
        setCurrentIndex((prevIndex) =>
          prevIndex + 1 <
          Math.ceil(testimonialsData.length / testimonialsPerPage)
            ? prevIndex + 1
            : 0
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLargeScreen]);

  // Display all testimonials on small screens, paginated on large screens
  const displayedTestimonials = isLargeScreen
    ? testimonialsData.slice(
        currentIndex * testimonialsPerPage,
        currentIndex * testimonialsPerPage + testimonialsPerPage
      )
    : testimonialsData;

  return (
    <div className="py-20 bg-gray-100 text-center overflow-hidden">
      <h2 className="text-4xl font-bold text-green-800">
        What Our Travelers Say
      </h2>
      <div className="mt-8 max-w-6xl mx-auto">
        {/* Container with dynamic height on small screens, fixed on large */}
        <div className="md:min-h-[320px] overflow-hidden">
          <motion.div
            key={isLargeScreen ? currentIndex : "static"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4"
          >
            {displayedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[200px]"
              >
                <p className="text-gray-700 italic mb-4 flex-grow line-clamp-4">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="flex justify-center text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="font-semibold text-green-800">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600">{testimonial.country}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots Navigation (visible only on large screens) */}
        <div className="mt-6 hidden md:flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(testimonialsData.length / testimonialsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              title={`Go to testimonial ${index + 1}`}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-green-600" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
