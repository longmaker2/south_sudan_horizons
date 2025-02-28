import React, { useState, useEffect } from "react";
import ProfileComponent from "../components/ProfileComponent";
import ChangePassword from "../components/ChangePassword";
import BookingHistory from "../components/BookingHistory";
import EditProfileModal from "../components/EditProfileModal";
import config from "../config"; // Import your config file

interface Tourist {
  name: string;
  email: string;
  profilePicture: string | null;
}

interface Booking {
  id: number;
  title: string;
  date: string;
  price: number;
  description: string;
}

const Profile: React.FC = () => {
  const [tourist, setTourist] = useState<Tourist>({
    name: "",
    email: "",
    profilePicture: null,
  });

  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch the user's profile from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(`${config.baseUrl}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Fetched profile data:", data); // Debugging log

        setTourist({
          name: data.fullName,
          email: data.email,
          profilePicture: data.profilePicture,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile updates
  const handleSaveProfile = (updatedTourist: Tourist) => {
    setTourist(updatedTourist);
  };

  // Simulated API Call for Booking History
  useEffect(() => {
    setTimeout(() => {
      setBookingHistory([
        {
          id: 1,
          title: "Boma National Park Safari",
          date: "2023-10-15",
          price: 600,
          description: "Explore one of Africa's largest national parks.",
        },
        {
          id: 2,
          title: "White Nile Rafting Adventure",
          date: "2023-09-25",
          price: 350,
          description: "Experience the thrill of rafting on the White Nile.",
        },
        {
          id: 3,
          title: "Juba Cultural Experience",
          date: "2023-08-10",
          price: 200,
          description: "Immerse yourself in the vibrant culture of Juba.",
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-15">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Tourist Dashboard
        </h1>

        {/* Profile Section */}
        <ProfileComponent
          tourist={tourist}
          onEditProfile={() => setIsEditingProfile(true)}
        />

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <EditProfileModal
            tourist={tourist}
            onClose={() => setIsEditingProfile(false)}
            onSave={handleSaveProfile}
          />
        )}

        {/* Change Password Form */}
        <ChangePassword
          currentPassword={""}
          setCurrentPassword={() => {}}
          newPassword={""}
          setNewPassword={() => {}}
          confirmPassword={""}
          setConfirmPassword={() => {}}
          showCurrentPassword={false}
          setShowCurrentPassword={() => {}}
          showNewPassword={false}
          setShowNewPassword={() => {}}
          showConfirmPassword={false}
          setShowConfirmPassword={() => {}}
          error={""}
          success={""}
          handlePasswordChange={() => {}}
        />

        {/* Booking History */}
        <BookingHistory loading={loading} bookingHistory={bookingHistory} />
      </div>
    </div>
  );
};

export default Profile;
