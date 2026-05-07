import { Suspense } from "react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VerifyForm from "@/components/auth/VerifyForm";
import Image from "next/image";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      <Image
        src="/assets/left.png"
        alt="decorative left-side background accent"
        width={80}
        height={500}
        className="absolute left-0 top-[40%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-[200px] w-auto object-contain"
      />
      <Image
        src="/assets/right.png"
        alt="decorative right-side background accent"
        width={180}
        height={400}
        className="absolute right-0 top-[50%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-[350px] w-auto object-contain"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopRibbon />
        <Header />

        <div className="w-full bg-[#f4faee] border-b border-gray-100">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My account</h1>
            <div className="text-sm text-gray-500">
              <span>Home</span> <span className="mx-2">/</span>{" "}
              <span className="text-gray-900 font-medium">My account</span>
            </div>
          </div>
        </div>

        <main
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
          data-aos="fade-up"
          data-aos-easing="ease-in"
        >
          <Suspense
            fallback={
              <div className="w-full max-w-sm mx-auto text-center text-gray-400 py-8">
                Loading...
              </div>
            }
          >
            <VerifyForm />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}
