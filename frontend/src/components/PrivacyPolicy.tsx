import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          {t("privacy.title")}
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          <strong>{t("privacy.lastUpdated")}</strong>
        </p>
        <p className="text-gray-700 mb-6">{t("privacy.intro")}</p>

        <ol className="list-decimal pl-6 space-y-6 text-gray-700">
          <li>
            <strong>{t("privacy.infoCollectTitle")}</strong>
            <p>{t("privacy.infoCollectText")}</p>
          </li>
          <li>
            <strong>{t("privacy.howWeUseTitle")}</strong>
            <p>{t("privacy.howWeUseText")}</p>
          </li>
          <li>
            <strong>{t("privacy.dataSharingTitle")}</strong>
            <p>{t("privacy.dataSharingText")}</p>
          </li>
          <li>
            <strong>{t("privacy.dataSecurityTitle")}</strong>
            <p>{t("privacy.dataSecurityText")}</p>
          </li>
          <li>
            <strong>{t("privacy.yourRightsTitle")}</strong>
            <p>
              {t("privacy.yourRightsText", {
                email: (
                  <a
                    href="mailto:support@southsudanhorizons.com"
                    className="text-green-700 hover:underline"
                  >
                    support@southsudanhorizons.com
                  </a>
                ),
              })}
            </p>
          </li>
          <li>
            <strong>{t("privacy.cookiesTitle")}</strong>
            <p>{t("privacy.cookiesText")}</p>
          </li>
          <li>
            <strong>{t("privacy.changesTitle")}</strong>
            <p>{t("privacy.changesText")}</p>
          </li>
          <li>
            <strong>{t("privacy.contactUsTitle")}</strong>
            <p>
              {t("privacy.contactUsText", {
                email: (
                  <a
                    href="mailto:support@southsudanhorizons.com"
                    className="text-green-700 hover:underline"
                  >
                    support@southsudanhorizons.com
                  </a>
                ),
              })}
            </p>
          </li>
        </ol>

        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            {t("privacy.backToRegistration")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
