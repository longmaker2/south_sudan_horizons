import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          required
          aria-label={label}
        />
        <span
          className="absolute top-2 right-3 cursor-pointer text-gray-600"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;
