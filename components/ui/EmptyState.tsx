import React from "react";

const EmptyState = ({ message = "No available data" }: { message?: string }) => {
  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-50 border border-blue-200 rounded-md px-8 py-10 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-10 text-blue-400 mx-auto mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <p className="text-gray-500">{message}</p>
      </div>
    </section>
  );
};

export default EmptyState;
