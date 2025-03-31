import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
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
          {t("terms.title")}
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          <strong>{t("terms.lastUpdated")}</strong>
        </p>
        <p className="text-gray-700 mb-6">{t("terms.intro")}</p>

        <ol className="list-decimal pl-6 space-y-6 text-gray-700">
          <li>
            <strong>{t("terms.acceptanceTitle")}</strong>
            <p>{t("terms.acceptanceText")}</p>
          </li>
          <li>
            <strong>{t("terms.eligibilityTitle")}</strong>
            <p>{t("terms.eligibilityText")}</p>
          </li>
          <li>
            <strong>{t("terms.accountResponsibilitiesTitle")}</strong>
            <p>
              {t("terms.accountResponsibilitiesText", {
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
            <strong>{t("terms.emailVerificationTitle")}</strong>
            <p>{t("terms.emailVerificationText")}</p>
          </li>
          <li>
            <strong>{t("terms.userRolesTitle")}</strong>
            <p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>{t("terms.userRolesTouristTitle")}</strong>{" "}
                  {t("terms.userRolesTouristText")}
                </li>
                <li>
                  <strong>{t("terms.userRolesGuideTitle")}</strong>{" "}
                  {t("terms.userRolesGuideText")}
                </li>
                <li>
                  <strong>{t("terms.userRolesAdminTitle")}</strong>{" "}
                  {t("terms.userRolesAdminText")}
                </li>
              </ul>
              {t("terms.userRolesFooter")}
            </p>
          </li>
          <li>
            <strong>{t("terms.useOfPlatformTitle")}</strong>
            <p>{t("terms.useOfPlatformText")}</p>
          </li>
          <li>
            <strong>{t("terms.paymentAndBookingsTitle")}</strong>
            <p>{t("terms.paymentAndBookingsText")}</p>
          </li>
          <li>
            <strong>{t("terms.intellectualPropertyTitle")}</strong>
            <p>{t("terms.intellectualPropertyText")}</p>
          </li>
          <li>
            <strong>{t("terms.privacyTitle")}</strong>
            <p>{t("terms.privacyText")}</p>
          </li>
          <li>
            <strong>{t("terms.terminationTitle")}</strong>
            <p>
              {t("terms.terminationText", {
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
            <strong>{t("terms.liabilityTitle")}</strong>
            <p>{t("terms.liabilityText")}</p>
          </li>
          <li>
            <strong>{t("terms.sustainabilityCommitmentTitle")}</strong>
            <p>{t("terms.sustainabilityCommitmentText")}</p>
          </li>
          <li>
            <strong>{t("terms.changesToTermsTitle")}</strong>
            <p>{t("terms.changesToTermsText")}</p>
          </li>
          <li>
            <strong>{t("terms.governingLawTitle")}</strong>
            <p>{t("terms.governingLawText")}</p>
          </li>
          <li>
            <strong>{t("terms.contactUsTitle")}</strong>
            <p>
              {t("terms.contactUsText", {
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

        <p className="text-gray-700 mt-6">{t("terms.agreementFooter")}</p>

        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            {t("terms.backToRegistration")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
