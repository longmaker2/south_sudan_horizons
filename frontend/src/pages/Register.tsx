import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { API_BASE_URL } from "../utils/api";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tourist");
  const [key, setKey] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError(t("register.errors.passwordMismatch"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role, key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t("register.errors.registrationFailed"));
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message || t("register.successMessage"));
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError(t("register.errors.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getProgressBarStyle = (password: string) => {
    const strength = calculatePasswordStrength(password);
    let width = 0;
    let color = "bg-red-500";

    switch (strength) {
      case 1:
        width = 25;
        color = "bg-red-500";
        break;
      case 2:
        width = 50;
        color = "bg-yellow-500";
        break;
      case 3:
        width = 75;
        color = "bg-green-500";
        break;
      case 4:
        width = 100;
        color = "bg-green-700";
        break;
      default:
        width = 0;
        color = "bg-red-500";
    }

    return { width: `${width}%`, color };
  };

  const progressBarStyle = getProgressBarStyle(password);

  const termsContent = (
    <div className="text-gray-700 text-sm">
      <p>
        <strong>{t("register.terms.lastUpdated")}</strong>
      </p>
      <p className="mt-2">{t("register.terms.welcome")}</p>
      <ol className="list-decimal pl-4 mt-2 space-y-2">
        {[...Array(15)].map((_, i) => (
          <li key={i}>
            <strong>{t(`register.terms.points.${i}.title`)}:</strong>{" "}
            {t(`register.terms.points.${i}.content`)}
          </li>
        ))}
      </ol>
      <p className="mt-2">
        <Link to="/terms" className="text-green-700 font-bold hover:underline">
          {t("register.terms.readFull")}
        </Link>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg w-96 my-16"
      >
        <h2 className="text-3xl font-bold text-green-800 text-center">
          {t("register.title")}
        </h2>
        <p className="text-gray-600 text-center mt-2">
          {t("register.subtitle")}
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("register.form.fullName")}
            </label>
            <input
              type="text"
              name="fullName"
              placeholder={t("register.form.fullNamePlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t("register.form.email")}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("register.form.emailPlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">
              {t("register.form.password")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("register.form.passwordPlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? t("register.hidePassword")
                  : t("register.showPassword")
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded ${progressBarStyle.color}`}
                style={{ width: progressBarStyle.width }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {t("register.passwordStrength")}:{" "}
              {calculatePasswordStrength(password)}/4
            </p>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">
              {t("register.form.confirmPassword")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={t("register.form.confirmPasswordPlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? t("register.hidePassword")
                  : t("register.showPassword")
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              {t("register.form.role")}
            </label>
            <select
              title={t("register.form.role")}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            >
              <option value="tourist">{t("register.roles.tourist")}</option>
              <option value="guide">{t("register.roles.guide")}</option>
              <option value="admin">{t("register.roles.admin")}</option>
            </select>
          </div>

          {(role === "guide" || role === "admin") && (
            <div className="mb-4">
              <label className="block text-gray-700">
                {role === "guide"
                  ? t("register.form.guideKey")
                  : t("register.form.adminKey")}
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={
                  role === "guide"
                    ? t("register.form.guideKeyPlaceholder")
                    : t("register.form.adminKeyPlaceholder")
                }
                className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
                required
              />
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-600 text-center">
              {successMessage}
            </div>
          )}

          <div className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer bg-green-100 p-2 rounded-lg"
              onClick={() => setShowTerms(!showTerms)}
            >
              <span className="text-green-800 font-semibold">
                {t("register.terms.title")}
              </span>
              {showTerms ? (
                <FaChevronUp className="text-green-800" />
              ) : (
                <FaChevronDown className="text-green-800" />
              )}
            </div>
            {showTerms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 border border-green-400 rounded-lg p-4 max-h-40 overflow-y-auto bg-gray-50"
              >
                {termsContent}
              </motion.div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 border border-green-400 rounded focus:ring-2 focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="text-gray-700">
              {t("register.terms.agree")}
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              t("register.form.submit")
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {t("register.haveAccount")}{" "}
          <Link
            to="/login"
            className="text-green-700 font-bold hover:underline"
          >
            {t("register.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
