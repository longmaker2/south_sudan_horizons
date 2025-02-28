import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../config";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(""); // Track password input
  const [role, setRole] = useState("tourist"); // Default role
  const [key, setKey] = useState(""); // For guide or admin key
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("Registration Form Data:", {
      fullName,
      email,
      password,
      confirmPassword,
      role,
      key,
    });

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role, key }),
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response as JSON
        console.error("Error Response:", errorData);

        // Display user-friendly error message
        setError(errorData.message || "Registration failed. Please try again.");
        return;
      }

      const data = await response.json(); // Parse the response as JSON
      console.log("Registration Success:", data);

      // Redirect to login page after successful registration
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Registration Error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    // Criteria for password strength
    if (password.length >= 8) strength += 1; // Minimum length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
    if (/[0-9]/.test(password)) strength += 1; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special character

    return strength;
  };

  // Function to get progress bar color and width based on password strength
  const getProgressBarStyle = (password: string) => {
    const strength = calculatePasswordStrength(password);
    let width = 0;
    let color = "bg-red-500"; // Default to red for weak password

    switch (strength) {
      case 1:
        width = 25;
        color = "bg-red-500"; // Weak
        break;
      case 2:
        width = 50;
        color = "bg-yellow-500"; // Medium
        break;
      case 3:
        width = 75;
        color = "bg-green-500"; // Strong
        break;
      case 4:
        width = 100;
        color = "bg-green-700"; // Very strong
        break;
      default:
        width = 0;
        color = "bg-red-500"; // Very weak
    }

    return { width: `${width}%`, color };
  };

  const progressBarStyle = getProgressBarStyle(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg w-96 "
      >
        <h2 className="text-3xl font-bold text-green-800 text-center">
          Register
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Create a new account to get started.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
            />
          </div>

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
              placeholder="Create a password"
              className="w-full border border-green-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-700"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Track password input
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {/* Password Strength Indicator */}
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded ${progressBarStyle.color}`}
                style={{ width: progressBarStyle.width }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Password strength: {calculatePasswordStrength(password)}/4
            </p>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
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

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 border border-green-400 rounded focus:ring-2 focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-green-700 font-bold hover:underline"
              >
                Terms and Conditions
              </Link>
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
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
