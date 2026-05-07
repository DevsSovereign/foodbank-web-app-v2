import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RootLoginForm from "@/components/auth/RootLoginForm";
import RootSignUpPrompt from "@/components/auth/RootSignUpPrompt";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafeff] relative overflow-hidden font-sans">
      <Image
        src="/assets/left.png"
        alt="side-banner"
        width={80}
        height={500}
        className="absolute left-0 top-[35%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-50 w-auto object-contain"
      />
      <Image
        src="/assets/right.png"
        alt="side-banner"
        width={180}
        height={400}
        className="absolute right-0 top-[45%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-87.5 w-auto object-contain"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopRibbon />
        <Header />

        <main
          className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12"
          data-aos="fade-up"
          data-aos-easing="ease-in"
        >
          <div className="mb-12 w-full">
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

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 w-full lg:pr-32 items-center lg:items-start">
            <div className="flex-[1.2] w-full flex justify-center lg:justify-start">
              <RootLoginForm />
            </div>

            <div className="hidden lg:block w-px bg-gray-200 self-stretch my-8" />

            <div className="flex-1 w-full hidden lg:block pt-8">
              <RootSignUpPrompt />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
