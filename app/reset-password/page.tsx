import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      <Image
        src="/assets/left.png"
        alt="decorative left-side background accent"
        width={80}
        height={500}
        className="absolute left-0 top-[40%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-50 w-auto object-contain"
      />
      <Image
        src="/assets/right.png"
        alt="decorative right-side background accent"
        width={180}
        height={400}
        className="absolute right-0 top-[50%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-87.5 w-auto object-contain"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopRibbon />
        <Header />

        <div className="w-full bg-[#f4faee] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="text-[15px] flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Home</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-800 font-medium">My Account</span>
            </div>
          </div>
        </div>

        <main
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
          data-aos="fade-up"
          data-aos-easing="ease-in"
        >
          <ResetPasswordForm />
        </main>

        <Footer />
      </div>
    </div>
  );
}
