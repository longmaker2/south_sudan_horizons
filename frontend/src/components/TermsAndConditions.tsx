import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          <strong>Last Updated: March 26, 2025</strong>
        </p>
        <p className="text-gray-700 mb-6">
          Welcome to South Sudan Horizons, a digital platform designed to
          promote sustainable tourism in South Sudan by showcasing its cultural
          heritage, natural beauty, and wildlife. By registering for an account,
          you agree to comply with and be bound by the following Terms and
          Conditions. Please read them carefully before completing your
          registration.
        </p>

        <ol className="list-decimal pl-6 space-y-6 text-gray-700">
          <li>
            <strong>Acceptance of Terms</strong>
            <p>
              By registering an account with South Sudan Horizons, you
              acknowledge that you have read, understood, and agree to these
              Terms and Conditions, as well as our Privacy Policy. If you do not
              agree, you may not register or use the platform.
            </p>
          </li>
          <li>
            <strong>Eligibility</strong>
            <p>
              You must be at least 18 years old to register an account. You must
              provide accurate, complete, and current information during
              registration, including your full name, email address, and, if
              applicable, a valid guide or admin key. Registration as a "Guide"
              or "Admin" requires a specific key provided by South Sudan
              Horizons administrators to ensure authorized access to restricted
              roles.
            </p>
          </li>
          <li>
            <strong>Account Responsibilities</strong>
            <p>
              You are responsible for maintaining the confidentiality of your
              password and account credentials. You agree to notify us
              immediately at{" "}
              <a
                href="mailto:support@southsudanhorizons.com"
                className="text-green-700 hover:underline"
              >
                support@southsudanhorizons.com
              </a>{" "}
              if you suspect any unauthorized use of your account. Your account
              is personal to you and may not be shared with or transferred to
              others.
            </p>
          </li>
          <li>
            <strong>Email Verification</strong>
            <p>
              Upon registration, you will receive a verification email to the
              address provided. You must verify your email within 1 hour by
              clicking the link provided, or your account may remain inactive
              until verification is completed. Failure to verify your email will
              prevent you from logging in or accessing platform features.
            </p>
          </li>
          <li>
            <strong>User Roles</strong>
            <p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>Tourist:</strong> General users who can browse, book
                  tours, submit reviews, and explore South Sudan’s attractions.
                </li>
                <li>
                  <strong>Guide:</strong> Authorized individuals who can create
                  and manage tour listings, subject to verification with a Guide
                  Key.
                </li>
                <li>
                  <strong>Admin:</strong> Platform administrators with full
                  access to manage content, users, and bookings, subject to
                  verification with an Admin Key.
                </li>
              </ul>
              Misrepresentation of your role (e.g., using an invalid key) may
              result in account suspension or termination.
            </p>
          </li>
          <li>
            <strong>Use of the Platform</strong>
            <p>
              You agree to use South Sudan Horizons solely for lawful purposes
              related to tourism, such as booking tours, exploring attractions,
              or managing tourism content (for Guides/Admins). You may not use
              the platform to post harmful, offensive, or misleading content,
              including false reviews or fraudulent tour listings. All content
              you submit must align with our mission of promoting sustainable
              tourism and respecting South Sudan’s cultural and natural
              heritage.
            </p>
          </li>
          <li>
            <strong>Payment and Bookings</strong>
            <p>
              Tour bookings are facilitated through Stripe, and you agree to
              provide accurate payment information. Refunds are subject to the
              policies of individual tour providers, as outlined during the
              booking process.
            </p>
          </li>
          <li>
            <strong>Intellectual Property</strong>
            <p>
              All content on South Sudan Horizons, including images, videos, and
              text, is owned by the platform or its contributors and is
              protected by copyright laws. By submitting content (e.g., reviews,
              tour photos), you grant South Sudan Horizons a non-exclusive,
              royalty-free license to use, display, and distribute it for
              promotional purposes.
            </p>
          </li>
          <li>
            <strong>Privacy</strong>
            <p>
              Your personal data will be collected, stored, and processed in
              accordance with our Privacy Policy, ensuring compliance with
              applicable data protection laws. We use your email for
              verification, notifications, and promotional updates (which you
              can opt out of).
            </p>
          </li>
          <li>
            <strong>Termination</strong>
            <p>
              We reserve the right to suspend or terminate your account if you
              violate these Terms and Conditions, misuse the platform, or engage
              in fraudulent activity. You may delete your account at any time by
              contacting{" "}
              <a
                href="mailto:support@southsudanhorizons.com"
                className="text-green-700 hover:underline"
              >
                support@southsudanhorizons.com
              </a>
              .
            </p>
          </li>
          <li>
            <strong>Liability</strong>
            <p>
              South Sudan Horizons is not liable for any damages arising from
              your use of the platform, including booking disputes or
              third-party interactions. The platform is provided “as is,” and we
              do not guarantee uninterrupted access, especially in areas with
              limited internet connectivity.
            </p>
          </li>
          <li>
            <strong>Sustainability Commitment</strong>
            <p>
              By registering, you agree to support our mission of sustainable
              tourism, which includes respecting local communities, preserving
              cultural heritage, and minimizing environmental impact during your
              interactions with South Sudan’s tourism offerings.
            </p>
          </li>
          <li>
            <strong>Changes to Terms</strong>
            <p>
              We may update these Terms and Conditions periodically. You will be
              notified of significant changes via email or a platform
              announcement. Continued use after updates constitutes acceptance
              of the revised terms.
            </p>
          </li>
          <li>
            <strong>Governing Law</strong>
            <p>
              These Terms and Conditions are governed by the laws of South
              Sudan. Any disputes will be resolved through mediation or courts
              in South Sudan.
            </p>
          </li>
          <li>
            <strong>Contact Us</strong>
            <p>
              For questions or concerns about these Terms, please email{" "}
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

        <p className="text-gray-700 mt-6">
          By checking the box and submitting your registration, you confirm your
          agreement to these Terms and Conditions.
        </p>

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

export default TermsAndConditions;
