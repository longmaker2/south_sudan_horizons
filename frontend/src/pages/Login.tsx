import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../config";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("tourist");
  const [key, setKey] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${config.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, key }),
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
      localStorage.setItem("role", role);

      // Set user data in AuthContext (which will also save to localStorage)
      login({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    try {
      const response = await fetch(`${config.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        setError(errorData.message || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Login Success:", data);

      // Store and verify token
      localStorage.setItem("token", data.token);
      console.log("Stored Token:", localStorage.getItem("token"));
      localStorage.setItem("role", role);

      login({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      setError("An unexpected error occurred. Please try again.");
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

          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              title="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            >
              <option value="tourist">Tourist</option>
              <option value="guide">Guide</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {(role === "guide" || role === "admin") && (
            <div className="mb-4">
              <label className="block text-gray-700">
                {role === "guide" ? "Guide Key" : "Admin Key"}
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={`Enter ${role} key`}
                className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
                required
              />
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
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
