import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import StayUpdated from "./StayUpdated";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-center text-sm">
        {/* Discover South Sudan */}
        <div>
          <h3 className="text-lg font-bold">Discover South Sudan</h3>
          <p className="mt-2 text-gray-300">
            Your gateway to meet the giants of Africa.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="/about" className="hover:text-green-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-green-400 transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-green-400 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-green-400 transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-bold">Follow Us</h3>
          <div className="flex space-x-4 mt-2 text-lg">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label="Twitter"
            >
              <FaTwitter />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </motion.a>
          </div>
        </div>

        {/* Stay Updated */}
        <StayUpdated />
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto text-center mt-8 text-gray-300">
        <p>&copy; 2025 South Sudan Horizons. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
