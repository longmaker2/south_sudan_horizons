import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaSearch, FaRegComments, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const guidesData = [
  {
    id: 1,
    name: "John Deng",
    expertise: "Wildlife & Safari",
    rating: 4.8,
    image: "/assets/guides/john.jpg",
    reviews: ["John made our safari an unforgettable experience!"],
    availableDates: ["2024-03-10", "2024-03-15", "2024-03-20"],
  },
  {
    id: 2,
    name: "Mary Akech",
    expertise: "Cultural Heritage",
    rating: 4.7,
    image: "/assets/guides/mary.jpg",
    reviews: ["Mary's knowledge of South Sudanese culture is impressive."],
    availableDates: ["2024-03-12", "2024-03-18", "2024-03-25"],
  },
  {
    id: 3,
    name: "Paul Lado",
    expertise: "Adventure & Trekking",
    rating: 4.9,
    image: "/assets/guides/paul.jpg",
    reviews: ["Paul took us on an amazing adventure trek!"],
    availableDates: ["2024-03-08", "2024-03-14", "2024-03-22"],
  },
];

const Guides = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const filteredGuides = guidesData.filter(
    (guide) =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "" || guide.expertise === filter)
  );

  return (
    <div className="min-h-screen bg-gray-100 mt-5">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/guides-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            Meet Your Guide
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            Explore South Sudan with experienced local guides who bring culture,
            history, and nature to life.
          </p>
        </div>
      </motion.div>

      {/* Search & Filter Section */}
      <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold text-green-800">Our Guides</h2>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guides..."
              className="border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-green-900 w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-green-500" />
          </div>
          <label htmlFor="filter" className="sr-only">
            Filter by specialty
          </label>
          <select
            id="filter"
            onChange={(e) => setFilter(e.target.value)}
            className="border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-green-900"
          >
            <option value="">All Specialties</option>
            <option value="Wildlife & Safari">Wildlife & Safari</option>
            <option value="Cultural Heritage">Cultural Heritage</option>
            <option value="Adventure & Trekking">Adventure & Trekking</option>
          </select>
        </div>
      </div>

      {/* Guides List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={guide.image}
                alt={guide.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-4 text-xl font-semibold text-green-800">
                {guide.name}
              </h3>
              <p className="text-gray-700">{guide.expertise}</p>
              <div className="mt-2 flex items-center text-green-700">
                <FaStar className="text-yellow-500" />
                <span className="ml-1 font-medium">{guide.rating}</span>
                {guide.rating >= 4.8 && (
                  <span className="ml-2 text-yellow-500 font-bold">
                    ⭐ Top Rated
                  </span>
                )}
              </div>

              {/* Available Dates */}
              <div className="mt-2 text-sm text-gray-600">
                <FaCalendarAlt className="inline-block mr-2 text-green-600" />
                <span>Next Available: {guide.availableDates[0]}</span>
              </div>

              {/* Live Chat Button */}
              <button className="mt-2 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                <FaRegComments className="mr-2" />
                Chat Now
              </button>

              <Link to={`/guides/${guide.id}`}>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 w-full">
                  View Profile
                </button>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-3">
            No guides found.
          </p>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12 bg-white text-center mb-5"
      >
        <h2 className="text-3xl font-bold text-green-800">
          Need a Personalized Guide?
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          Get a customized tour experience with one of our expert guides.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300">
          Book a Guide
        </button>
      </motion.div>
    </div>
  );
};

export default Guides;
