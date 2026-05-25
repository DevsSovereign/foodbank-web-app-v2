import { ReactNode, useState } from "react";
import { Home } from "lucide-react";
import CategoryDropdown from "../layout/CategoryDropdown";
import Link from "next/link";

interface Props {
  currentLocationData: ReactNode;
}

const SubHeader = ({ currentLocationData }: Props) => {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  return (
    <nav className="bg-[#f4faee] border-b border-gray-100 py-3 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="text-sm font-medium flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
          >
            <Home className="size-4" />
            <span>Home</span>
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-800">{currentLocationData}</span>
        </div>

        <button
          className="md:hidden text-gray-600 p-1"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileNavOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 12v0M4 6v0M4 18v0M8 12h12M8 6h12M8 18h12" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-6">
          <CategoryDropdown triggerStyle="pageNav" />

          <Link
            href="/dashboard/track-delivery"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Track Order
          </Link>

          <Link
            href="/dashboard/support"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            Customer Support
          </Link>

          <Link
            href="/dashboard/help-center"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Help Center
          </Link>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-sm px-4 py-3 pb-4 space-y-4">
          <CategoryDropdown triggerStyle="pageNav" />

          <Link
            href="/dashboard/track-delivery"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Track Order
          </Link>

          <Link
            href="/dashboard/support"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            Customer Support
          </Link>

          <Link
            href="/dashboard/help-center"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Help Center
          </Link>
        </div>
      )}
    </nav>
  );
};

export default SubHeader;
