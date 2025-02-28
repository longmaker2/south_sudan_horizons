import { motion } from "framer-motion";

const teamMembers = [
  {
    id: 1,
    name: "James Deng",
    role: "Founder & CEO",
    image: "/assets/team/james.jpg",
  },
  {
    id: 2,
    name: "Sarah Akot",
    role: "Lead Tour Guide",
    image: "/assets/team/sarah.jpg",
  },
  {
    id: 3,
    name: "David Lado",
    role: "Cultural Expert",
    image: "/assets/team/david.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/about-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">About Us</h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            Discover the story behind South Sudan Horizons and our passion for
            showcasing the beauty and culture of South Sudan.
          </p>
        </div>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">Our Mission</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
          At South Sudan Horizons, our mission is to connect travelers with
          authentic South Sudanese experiences, guided by local experts who
          bring history, culture, and adventure to life.
        </p>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-green-100 py-16 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800">Why Choose Us?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                Authentic Experiences
              </h3>
              <p className="text-gray-700 mt-2">
                We bring you real, local experiences with expert guides who know
                South Sudan best.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                Safety First
              </h3>
              <p className="text-gray-700 mt-2">
                Your safety is our top priority, and we ensure every journey is
                secure and comfortable.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                Community Impact
              </h3>
              <p className="text-gray-700 mt-2">
                By choosing us, you support local businesses and help preserve
                South Sudanese culture.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Meet the Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">Meet Our Team</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-4 text-xl font-semibold text-green-800">
                {member.name}
              </h3>
              <p className="text-gray-700">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12 bg-white text-white text-center"
      >
        <h2 className="text-3xl font-bold text-green-800">Join Our Journey</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          Whether you're looking for an adventure, cultural immersion, or a
          local experience, we're here to guide you.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-800 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300">
          Contact Us
        </button>
      </motion.div>
    </div>
  );
};

export default About;
