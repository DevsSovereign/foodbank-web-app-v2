"use client";

interface ErrorSectionProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorSection({ message, onRetry }: ErrorSectionProps) {
  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 border border-red-200 rounded-md px-8 py-10 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-10 text-red-400 mx-auto mb-4"
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
        <h2 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#8cc629] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#7db424] transition-colors uppercase tracking-wide"
          >
            Try Again
          </button>
        )}
      </div>
    </section>
  );
}
