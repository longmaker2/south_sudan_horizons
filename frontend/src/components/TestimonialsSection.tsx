import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Sample Testimonials Data
const testimonialsData = [
  {
    id: 1,
    name: "Diana Otieno",
    country: "USA",
    text: "testimonials.testimonial1",
  },
  {
    id: 2,
    name: "Daniel Burongu",
    country: "UK",
    text: "testimonials.testimonial2",
  },
  {
    id: 3,
    name: "Brian Kayongo",
    country: "Spain",
    text: "testimonials.testimonial3",
  },
  {
    id: 4,
    name: "James Deng",
    country: "South Sudan",
    text: "testimonials.testimonial4",
  },
  {
    id: 5,
    name: "Ruth Senior",
    country: "Canada",
    text: "testimonials.testimonial5",
  },
  {
    id: 6,
    name: "David Mazimpaka",
    country: "South Korea",
    text: "testimonials.testimonial6",
  },
];

const Testimonials = () => {
  const { t } = useTranslation();
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
        {t("testimonials.title")}
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
                  "{t(testimonial.text)}"
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
              title={t("testimonials.goToTestimonial", { number: index + 1 })}
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
