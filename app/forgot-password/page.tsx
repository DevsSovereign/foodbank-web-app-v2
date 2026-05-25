"use client"

import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [identifier, setIdentifier] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const validateIdentifier = (value: string): string => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const identifierErr = validateIdentifier(identifier);
    if (identifierErr) newErrors.identifier = identifierErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // continue from here
  };

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
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="login-identifier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400" />
                </div>
                <input
                  id="login-identifier"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Your email/phone number"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
                  }}
                  disabled={isLoading}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.identifier
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#6cc200] focus:border-[#6cc200]"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
              )}
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </div>
  );
}
