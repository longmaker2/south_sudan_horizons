import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

interface Tourist {
  name: string;
  email: string;
  profilePicture: string | null;
}

interface EditProfileModalProps {
  tourist: Tourist;
  onClose: () => void;
  onSave: (updatedTourist: Tourist) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  tourist,
  onClose,
  onSave,
}) => {
  const [editedName, setEditedName] = useState(tourist.name);
  const [editedEmail, setEditedEmail] = useState(tourist.email);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("fullName", editedName);
    formData.append("email", editedEmail);
    if (file) {
      formData.append("profilePicture", file);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSave({
        name: response.data.fullName,
        email: response.data.email,
        profilePicture: response.data.profilePicture,
      });
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            title="Close"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              title="Choose a profile picture"
              placeholder="Choose a profile picture"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center"
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
