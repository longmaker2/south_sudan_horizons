import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Chat from "../components/Chat";
import { useTranslation } from "react-i18next";

// Mock data for available guides
const availableGuides = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "Diana Otieno",
    profile: "Experienced guide with 5+ years of expertise in mountain tours.",
    email: "d.otieno@alustudent.com",
    phone: "+123 456 7890",
    testimonials: [
      {
        text: "Diana was an amazing guide! He made our trip unforgettable.",
        author: "Ruth S.",
      },
      {
        text: "Highly recommend John for mountain tours. He's very knowledgeable!",
        author: "David M.",
      },
    ],
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Daniel Burongu",
    profile: "Specializes in cultural and historical tours.",
    email: "d.burongu@alustudent.com",
    phone: "+123 456 7891",
    testimonials: [
      {
        text: "Daniel is fantastic! Her knowledge of history is unparalleled.",
        author: "Ayuel M.",
      },
    ],
  },
  {
    id: "507f1f77bcf86cd799439013",
    name: "Kayongo Brian",
    profile: "Adventure guide with a focus on extreme sports.",
    email: "b.kayongo@alustudent.com",
    phone: "+123 456 7892",
    testimonials: [
      {
        text: "Brian made our adventure trip thrilling and safe!",
        author: "Chol G.",
      },
    ],
  },
];

const GuideProfile = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook to access translations
  const guide = availableGuides.find((g) => g.id === guideId);

  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!guide) {
    return (
      <div className="text-center py-12 text-gray-700">
        <p>{t("guideProfile.notFound")}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          {t("guideProfile.backToBooking")}
        </button>
      </div>
    );
  }

  const handleChat = () => {
    setIsChatOpen(true);
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 mt-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <img
          src="https://via.placeholder.com/800x400"
          alt={t("guideProfile.imageAlt", { name: guide.name })}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h1 className="text-3xl font-bold text-green-800 mt-6">{guide.name}</h1>
        <p className="mt-4 text-gray-600">{guide.profile}</p>

        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-yellow-500">★★★★☆</span>
            <span className="ml-2 text-gray-600">
              {t("guideProfile.rating")}
            </span>
          </div>
          <button
            onClick={() => alert("View all reviews")}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            {t("guideProfile.viewReviews")}
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.specializationsTitle")}
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            <li>{t("guideProfile.specialization1")}</li>
            <li>{t("guideProfile.specialization2")}</li>
            <li>{t("guideProfile.specialization3")}</li>
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.languagesTitle")}
          </h2>
          <p className="mt-2 text-gray-600">{t("guideProfile.languages")}</p>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.certificationsTitle")}
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            <li>{t("guideProfile.certification1")}</li>
            <li>{t("guideProfile.certification2")}</li>
            <li>{t("guideProfile.certification3")}</li>
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.tourPackagesTitle")}
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            <li>{t("guideProfile.tourPackage1")}</li>
            <li>{t("guideProfile.tourPackage2")}</li>
            <li>{t("guideProfile.tourPackage3")}</li>
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.contactTitle")}
          </h2>
          <p className="mt-2 text-gray-600">
            {t("guideProfile.emailLabel")}: {guide.email}
          </p>
          <p className="mt-2 text-gray-600">
            {t("guideProfile.phoneLabel")}: {guide.phone}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.followTitle")}
          </h2>
          <div className="mt-2 flex space-x-4">
            <a
              href="https://facebook.com"
              className="text-green-600 hover:text-green-800"
              title={t("guideProfile.followFacebook")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              className="text-green-600 hover:text-green-800"
              title={t("guideProfile.followInstagram")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="text-green-600 hover:text-green-800"
              title={t("guideProfile.followTwitter")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              className="text-green-600 hover:text-green-800"
              title={t("guideProfile.followLinkedIn")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-green-800">
            {t("guideProfile.testimonialsTitle")}
          </h2>
          <div className="mt-2 space-y-4">
            {guide.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">"{testimonial.text}"</p>
                <p className="mt-2 text-sm text-gray-500">
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleChat}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            {t("guideProfile.chatButton", { name: guide.name })}
          </button>
          <button
            onClick={handleBackToBooking}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            {t("guideProfile.backToBooking")}
          </button>
        </div>
      </div>

      {/* Use the Chat component */}
      <Chat
        guideName={guide.name}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default GuideProfile;
