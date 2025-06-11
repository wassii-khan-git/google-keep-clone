import React from "react";

const EmptyNotes = () => {
  return (
    <div className="col-span-4 text-center py-12">
      <div className="text-gray-400 mb-2">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-1">No Notes Found</h3>
      <p className="text-gray-500">Create your first note to get started!</p>
    </div>
  );
};

export default EmptyNotes;
