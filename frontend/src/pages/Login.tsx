import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL } from "../utils/api";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t("login.errors.loginFailed"));
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      login({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture || null,
      });

      switch (data.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "guide":
          navigate("/guide-dashboard");
          break;
        case "tourist":
          navigate("/");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(t("login.errors.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold text-green-800 text-center">
          {t("login.title")}
        </h2>
        <p className="text-gray-600 text-center mt-2">{t("login.subtitle")}</p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("login.form.email")}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("login.form.emailPlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">
              {t("login.form.password")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login.form.passwordPlaceholder")}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? t("login.hidePassword") : t("login.showPassword")
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center">
              {error}
              {error === t("login.errors.verifyEmail") && (
                <p className="mt-2">{t("login.checkInbox")}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              t("login.form.submit")
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {t("login.noAccount")}{" "}
          <Link
            to="/register"
            className="text-green-700 font-bold hover:underline"
          >
            {t("login.register")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
