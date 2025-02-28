import React, { useState } from "react";
import axios from "axios";
import config from "../config";

interface UploadProfilePictureProps {
  onUploadSuccess: (filePath: string) => void;
}

const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({
  onUploadSuccess,
}) => {
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
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${config.baseUrl}/api/auth/update-profile`,
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
      setError("Failed to upload profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label htmlFor="profilePicture">Upload Profile Picture</label>
      <input
        id="profilePicture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default UploadProfilePicture;
