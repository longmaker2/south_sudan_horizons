import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import StayUpdated from "./StayUpdated";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-center text-sm">
        {/* Discover South Sudan */}
        <div>
          <h3 className="text-lg font-bold">{t("footer.discoverTitle")}</h3>
          <p className="mt-2 text-gray-300">
            {t("footer.discoverDescription")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold">{t("footer.quickLinksTitle")}</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/about" className="hover:text-green-400 transition">
                {t("footer.aboutUs")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-400 transition">
                {t("footer.contact")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-green-400 transition">
                {t("footer.privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-green-400 transition">
                {t("footer.termsOfService")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-bold">{t("footer.followUsTitle")}</h3>
          <div className="flex space-x-4 mt-2 text-lg">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label={t("footer.socialAriaLabels.facebook")}
            >
              <FaFacebookF />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label={t("footer.socialAriaLabels.instagram")}
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label={t("footer.socialAriaLabels.twitter")}
            >
              <FaTwitter />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="hover:text-green-400 transition"
              aria-label={t("footer.socialAriaLabels.linkedin")}
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
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
};

export default Footer;
