import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export default function MyAccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafeff] relative overflow-hidden font-sans">
      <Image
        src="/assets/left.png"
        alt="decorative left-side background accent"
        width={80}
        height={500}
        className="absolute left-0 top-[35%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-[200px] w-auto object-contain"
      />
      <Image
        src="/assets/right.png"
        alt="decorative right-side background accent"
        width={180}
        height={400}
        className="absolute right-0 top-[45%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-[350px] w-auto object-contain"
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

          <div className="w-full">
            <div className="mb-8">
              <p className="text-gray-500 text-base mb-1">Good Morning, FoodBanker</p>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#5ba800] to-[#8cc629] p-10 md:p-14 text-white shadow-xl shadow-green-100/50 w-full">
              <div className="relative z-10 w-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                  Unlock Your FoodBank Experience
                </h2>
                <p className="text-[16px] md:text-[18px] font-medium mb-10 leading-[1.4] opacity-90 lg:whitespace-nowrap">
                  Create an account today to access exclusive features, track your orders, and
                  manage your deliveries seamlessly.
                </p>

                <div className="flex flex-row gap-3 sm:gap-5">
                  <Link
                    href="/signup"
                    className="bg-[#8cc629] border border-white/20 hover:bg-[#7db424] text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-center transition-all shadow-lg active:scale-95 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/login"
                    className="bg-white hover:bg-gray-50 text-[#8cc629] px-4 sm:px-12 py-3 sm:py-4 rounded-lg font-bold text-center transition-all shadow-lg active:scale-95 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="absolute -top-24 -right-24 size-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 size-96 bg-black/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
