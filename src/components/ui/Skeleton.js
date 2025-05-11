"use client";

const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-300 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" />
    </div>
  );
};

export default Skeleton;
