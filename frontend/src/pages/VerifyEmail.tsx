import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { useAuth } from "../context/useAuth";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role); // Optional, since role is in token
          fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${data.token}` },
          })
            .then((res) => res.json())
            .then((userData) => {
              login({
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
                profilePicture: userData.profilePicture || null,
              });
              setMessage("Email verified successfully! Redirecting...");
              setTimeout(() => {
                switch (userData.role) {
                  case "admin":
                    navigate("/admin-dashboard");
                    break;
                  case "guide":
                    navigate("/guide-dashboard");
                    break;
                  default:
                    navigate("/");
                    break;
                }
              }, 2000);
            })
            .catch((err) => {
              console.error("Profile fetch error:", err);
              setMessage("Error fetching profile. Please log in manually.");
              setTimeout(() => navigate("/login"), 2000);
            });
        } else {
          setMessage(data.message || "Verification failed.");
          setTimeout(() => navigate("/login"), 2000);
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setMessage("An error occurred during verification.");
        setTimeout(() => navigate("/login"), 2000);
      });
  }, [navigate, login, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-green-800">{message}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;
