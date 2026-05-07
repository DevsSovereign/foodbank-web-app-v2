"use client";

import { useState } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { ApiError } from "@/types/api";

export default function SignUpForm() {
  const router = useRouter();

  // — Field state ———————————————————————————————
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // — UI state ——————————————————————————————————
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // — Validation errors (per-field) ——————————————
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** Validate email format. */
  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Prepend country code to phone number
      const fullPhone = phone.startsWith("0") ? `0${phone.slice(1)}` : phone;

      const response = await authService.register({
        email: email.trim(),
        phoneNumber: fullPhone,
        password,
        ...(referralCode.trim() && { accountOfficerCode: referralCode.trim() }),
      });

      setSuccessMessage(response.message || "Account created successfully!");

      // Send OTP to the user's email for verification
      try {
        await authService.sendOtp({ email: email.trim() });
      } catch {
        // OTP send failure is non-blocking — they can resend on the verify page
      }

      // Redirect to verify page with email as query param
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email.trim())}`);
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        // If the account already exists, assume email may not be verified —
        // send OTP and redirect to the verify page.
        const isAlreadyExists = err.message.toLowerCase().includes("already exists");

        if (isAlreadyExists && email.trim()) {
          // Try sending OTP — success means email is unverified,
          // failure means email is already verified → go to login.
          try {
            await authService.sendOtp({ email: email.trim() });
            setSuccessMessage("Account already exists. Redirecting to verify your email...");
            setTimeout(() => {
              router.push(`/verify?email=${encodeURIComponent(email.trim())}`);
            }, 1500);
          } catch {
            // OTP failed → email is already verified, just login
            setSuccessMessage("Account already verified. Redirecting to login...");
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          }
          return;
        }

        setErrors({ api: err.message });
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhone(val);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">SIGN UP</h2>

      {/* API-level error banner */}
      {errors.api && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
          {errors.api}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="size-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              disabled={isLoading}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-[#6cc200] focus:border-[#6cc200]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-600">
              <div className="size-5 rounded-full bg-green-500 overflow-hidden flex flex-col justify-center border border-gray-200">
                <div className="h-full w-1/3 bg-white mx-auto"></div>
              </div>
              <span className="ml-2 text-sm">+234</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder=""
              disabled={isLoading}
              className={`block w-full flex-1 pl-3 pr-3 py-2 border rounded-r-md focus:outline-none focus:ring-1 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-[#6cc200] focus:border-[#6cc200]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Password */}
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              disabled={isLoading}
              className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-[#6cc200] focus:border-[#6cc200]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
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
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              disabled={isLoading}
              className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-[#6cc200] focus:border-[#6cc200]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Referral Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referral Code (Optional)
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6cc200] focus:border-[#6cc200] disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Terms */}
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
              }}
              disabled={isLoading}
              className="size-4 text-[#6cc200] bg-gray-100 border-gray-300 rounded focus:ring-[#6cc200] focus:ring-2"
            />
          </div>
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-[#21a84f] font-semibold hover:underline"
            >
              Terms and Conditions
            </Link>
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs -mt-4">{errors.terms}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !agreedToTerms}
          className="w-full bg-[#6cc200] text-white font-medium py-3 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6 lg:hidden">
          Already have an account?{" "}
          <Link href="/login" className="text-[#21a84f] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
