"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/lib/services/auth.service";
import { ApiError } from "@/types/api";

export default function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendStatus, setResendStatus] = useState<"idle" | "sent">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 4) {
      setOtp(val);
      if (error) setError("");
    }
  };

  /** Resend the OTP to the user's email. */
  const handleResend = async () => {
    if (!email) return;

    try {
      await authService.sendOtp({ email });
      setTimeLeft(60);
      setResendStatus("sent");
      setError("");

      setTimeout(() => {
        setResendStatus("idle");
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    }
  };

  /** Verify the OTP. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.verifyOtp({ email, otp });
      setSuccessMessage(response.message || "Email verified successfully!");

      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">VERIFY ACCOUNT</h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        A four (4) digit code has been sent to your email address
      </p>

      {/* Error banner */}
      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP sent to <span className="text-[#f16322]">{email || "your email"}</span>
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Input four digit"
            disabled={isLoading}
            className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#6cc200] focus:border-[#6cc200] text-center tracking-widest text-lg disabled:opacity-60 disabled:cursor-not-allowed ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex justify-end mt-2">
            <span className="text-[#f16322] text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length < 4}
          className="w-full bg-[#6cc200] text-white font-medium py-3 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center text-sm mt-6">
          {resendStatus === "sent" ? (
            <p className="text-green-600 font-medium animate-pulse">
              New code has been sent to your email!
            </p>
          ) : (
            <p className="text-gray-600">
              Didn&apos;t receive the OTP?{" "}
              <button
                type="button"
                className="text-[#21a84f] font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResend}
                disabled={timeLeft > 0}
              >
                Resend
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
