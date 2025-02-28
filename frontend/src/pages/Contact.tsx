import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/contact-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">Contact Us</h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            Have questions? Get in touch with us, and we’ll be happy to assist
            you.
          </p>
        </div>
      </motion.div>

      {/* Contact Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">Get in Touch</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
          Whether you have a question about tours, guides, pricing, or anything
          else, our team is ready to assist.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <FaPhoneAlt className="text-green-700 text-4xl" />
            <h3 className="mt-4 text-xl font-semibold text-green-800">
              Call Us
            </h3>
            <p className="text-gray-700 mt-2">+211 987 654 321</p>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <FaEnvelope className="text-green-700 text-4xl" />
            <h3 className="mt-4 text-xl font-semibold text-green-800">
              Email Us
            </h3>
            <p className="text-gray-700 mt-2">info@southsudanhorizons.com</p>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <FaMapMarkerAlt className="text-green-700 text-4xl" />
            <h3 className="mt-4 text-xl font-semibold text-green-800">
              Visit Us
            </h3>
            <p className="text-gray-700 mt-2">Juba, South Sudan</p>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 bg-green-100 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800">
            Send Us a Message
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            We’ll get back to you as soon as possible.
          </p>

          <form className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
                required
              />
            </div>
            <textarea
              placeholder="Your Message"
              className="w-full mt-4 border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700 h-32"
              required
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </motion.div>

      {/* Google Maps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800">
            Find Us on the Map
          </h2>
          <div className="mt-6 w-full h-80 rounded-lg shadow-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345096193!2d32.57609971566952!3d4.8516500424829905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x173c5f0e10aa80f3%3A0x5b33f54d3f3b52b8!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2s!4v1633208824887!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
