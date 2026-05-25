"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">RESET PASSWORD</h2>
      <p className="text-gray-500 text-sm mb-12 text-center max-w-xs">
        Password must be at least 8 characters and include letters and numbers.
      </p>

      <form className="w-full space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image
                src="/assets/teenyicons_password-outline.svg"
                alt="Password icon"
                width={20}
                height={20}
                className="opacity-50"
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6cc200] focus:border-[#6cc200]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image
                src="/assets/teenyicons_password-outline.svg"
                alt="Password icon"
                width={20}
                height={20}
                className="opacity-50"
              />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Your password"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6cc200] focus:border-[#6cc200]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="w-full bg-[#6cc200] text-white font-medium py-3 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
