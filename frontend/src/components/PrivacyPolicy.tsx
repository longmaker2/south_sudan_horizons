import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          <strong>Last Updated: March 26, 2025</strong>
        </p>
        <p className="text-gray-700 mb-6">
          At South Sudan Horizons, we are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your
          personal information when you use our platform.
        </p>

        <ol className="list-decimal pl-6 space-y-6 text-gray-700">
          <li>
            <strong>Information We Collect</strong>
            <p>
              We collect personal information such as your full name, email
              address, and payment details (via Stripe) when you register, book
              tours, or interact with our services.
            </p>
          </li>
          <li>
            <strong>How We Use Your Information</strong>
            <p>
              Your data is used to process bookings, verify your account, send
              notifications, and provide personalized tour recommendations. We
              may also use it for marketing purposes (with your consent).
            </p>
          </li>
          <li>
            <strong>Data Sharing</strong>
            <p>
              We share your information with tour guides (for booking purposes)
              and payment processors (Stripe). We do not sell your data to third
              parties.
            </p>
          </li>
          <li>
            <strong>Data Security</strong>
            <p>
              We implement reasonable security measures to protect your
              information, but no system is completely secure. You use our
              platform at your own risk.
            </p>
          </li>
          <li>
            <strong>Your Rights</strong>
            <p>
              You can access, update, or delete your account by contacting us at{" "}
              <a
                href="mailto:support@southsudanhorizons.com"
                className="text-green-700 hover:underline"
              >
                support@southsudanhorizons.com
              </a>
              . You may opt out of promotional emails at any time.
            </p>
          </li>
          <li>
            <strong>Cookies</strong>
            <p>
              We use cookies to enhance your experience (e.g., remembering login
              details). You can disable cookies in your browser settings.
            </p>
          </li>
          <li>
            <strong>Changes to This Policy</strong>
            <p>
              We may update this Privacy Policy. Changes will be posted here,
              and significant updates will be communicated via email or platform
              announcements.
            </p>
          </li>
          <li>
            <strong>Contact Us</strong>
            <p>
              For questions, email{" "}
              <a
                href="mailto:support@southsudanhorizons.com"
                className="text-green-700 hover:underline"
              >
                support@southsudanhorizons.com
              </a>
              .
            </p>
          </li>
        </ol>

        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Back to Registration
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
