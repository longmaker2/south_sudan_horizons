import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const strength = Math.min(password.length * 10, 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-green-600 h-2 rounded-full"
        style={{ width: `${strength}%` }}
      ></div>
    </div>
  );
};

export default PasswordStrengthMeter;
