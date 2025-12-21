import React from "react";

const Loader = ({ cardClass = "" }) => {
  return (
    <div
      className={`w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse ${cardClass}`}
    >
      {/* Cover Image */}
      <div className="h-44 w-full bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>

        {/* Button */}
        <div className="h-9 bg-gray-200 rounded-lg w-full mt-3" />
      </div>
    </div>
  );
};

export default Loader;
