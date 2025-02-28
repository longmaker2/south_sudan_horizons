import React from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import PasswordInput from "./PasswordInput";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

interface ChangePasswordProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  error: string;
  success: string;
  handlePasswordChange: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  error,
  success,
  handlePasswordChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <FaLock className="mr-2" /> Change Password
      </h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        {/* Current Password */}
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          showPassword={showCurrentPassword}
          togglePasswordVisibility={() =>
            setShowCurrentPassword(!showCurrentPassword)
          }
        />

        {/* New Password */}
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          showPassword={showNewPassword}
          togglePasswordVisibility={() => setShowNewPassword(!showNewPassword)}
        />
        <PasswordStrengthMeter password={newPassword} />

        {/* Confirm New Password */}
        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showConfirmPassword}
          togglePasswordVisibility={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />

        {/* Error and Success Messages */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          className="w-small px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Change Password
        </button>
      </form>
    </motion.div>
  );
};

export default ChangePassword;
