import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const StayUpdated = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    // Simulate an API call with a delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setEmail(""); // Clear the input field
      setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-sm"
    >
      <h3 className="text-lg font-bold">{t("stayUpdated.title")}</h3>
      <p className="text-gray-300">{t("stayUpdated.subtitle")}</p>
      <form onSubmit={handleSubscribe} className="mt-2 flex flex-col space-y-2">
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder={t("stayUpdated.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-300 placeholder-gray-300"
            required
          />
          <AnimatePresence>
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-1 text-red-500 text-xs"
              >
                {t("stayUpdated.emailError")}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm flex items-center justify-center"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            t("stayUpdated.subscribeButton")
          )}
        </button>
      </form>

      {/* Success Message */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-green-500 text-sm flex items-center space-x-2"
          >
            <FaCheck />
            <span>{t("stayUpdated.successMessage")}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StayUpdated;
