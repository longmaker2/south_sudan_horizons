import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { useTranslation } from "react-i18next";

interface UploadProfilePictureProps {
  onUploadSuccess: (filePath: string) => void;
}

const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({
  onUploadSuccess,
}) => {
  const { t } = useTranslation(); // Hook to access translations
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError(t("uploadProfilePicture.noFileError"));
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      setError("");

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

      onUploadSuccess(response.data.profilePicture);
    } catch {
      setError(t("uploadProfilePicture.uploadFailedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="profilePicture"
        className="block text-sm font-medium text-gray-700"
      >
        {t("uploadProfilePicture.label")}
      </label>
      <input
        id="profilePicture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading
          ? t("uploadProfilePicture.uploading")
          : t("uploadProfilePicture.upload")}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default UploadProfilePicture;
