import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEdit } from "react-icons/fa";
import config from "../config";

interface Tourist {
  name: string;
  email: string;
  profilePicture: string | null;
}

interface ProfileComponentProps {
  tourist: Tourist;
  onEditProfile: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
  tourist,
  onEditProfile,
}) => {
  // Function to get initials from the user's name
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const imageUrl = tourist.profilePicture
    ? `${config.baseUrl}/uploads/${tourist.profilePicture}`
    : null;

  console.log("Image URL:", imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <FaUser className="mr-2" /> Profile
      </h2>
      <div className="flex items-center space-x-4">
        {/* Display profile picture or initials */}
        {tourist.profilePicture ? (
          <img
            src={imageUrl || ""}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(tourist.name)}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">{tourist.name}</p>
          <p className="text-gray-600">{tourist.email}</p>
        </div>
      </div>
      <button
        onClick={onEditProfile}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center"
      >
        <FaEdit className="mr-2" /> Edit Profile
      </button>
    </motion.div>
  );
};

export default ProfileComponent;
