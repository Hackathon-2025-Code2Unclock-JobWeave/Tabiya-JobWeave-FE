import React from "react";

const LoadingSpinner = ({ size = "medium", text = "", className = "" }) => {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizes[size]}`}
      ></div>
      {text && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
