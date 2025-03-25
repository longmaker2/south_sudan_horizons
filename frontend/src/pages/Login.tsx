import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL } from "../utils/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Removed role and key from login payload (not needed now)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        setError(errorData.message || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Login Success:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // Use role from response, not form

      // Set user data in AuthContext (which will also save to localStorage)
      login({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture || null, // this ensures profilePicture is handled
      });

      // Redirect based on role from response
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
          navigate("/"); // Fallback to home page if role is unrecognized
          break;
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An unexpected error occurred. Please try again.");
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
        <h2 className="text-3xl font-bold text-green-800 text-center">Login</h2>
        <p className="text-gray-600 text-center mt-2">
          Welcome back! Please log in to continue.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Removed role and key inputs from login form */}
          {error && (
            <div className="mb-4 text-red-600 text-center">
              {error}
              {error === "Please verify your email before logging in." && (
                <p className="mt-2">
                  Check your inbox (and spam folder) for a verification email.
                </p>
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
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
