"use client";

import { useState, useEffect } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { userService } from "@/lib/services/user.service";
import { setAuthToken, STORAGE_KEYS } from "@/lib/auth-utils";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "../ui/toast/ToastProvider";
import { handleError } from "@/lib/handle-error";

export default function RootLoginForm() {
  const router = useRouter();

  // — Field state ———————————————————————————————
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // — UI state ——————————————————————————————————
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // — Validation ————————————————————————————————
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  // store
  const { setUser } = useUserStore();

  // — Restore saved identifier on mount ————————
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMEMBER_IDENTIFIER);
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    }
  }, []);

  /** Validate identifier (email or phone). */
  const validateIdentifier = (value: string): string => {
    if (!value.trim()) return "Email or phone number is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]+$/;
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      return "Please enter a valid email address or phone number";
    }
    return "";
  };

  /** Client-side validation before hitting the API. */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const identifierErr = validateIdentifier(identifier);
    if (identifierErr) newErrors.identifier = identifierErr;

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission. */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({
        identifier: identifier.trim(),
        password,
      });

      // Store auth token and user data
      setAuthToken(response.token);

      // Persist or clear the "remember me" identifier
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_IDENTIFIER, identifier.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_IDENTIFIER);
      }

      const { customer } = await userService.getCustomer();
      setUser(customer);

      // Redirect to homepage
      router.push("/");
    } catch (err) {
      const errorMsg = handleError(err);
      toast({ variant: "error", title: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">LOGIN</h2>

      <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
        {/* Email / Phone */}
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
          {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
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
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#6cc200] text-white font-medium py-3 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Google Sign-In */}
        {/* <button
          type="button"
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 text-[#21a84f] font-semibold py-3 px-4 rounded-md hover:bg-gray-50 transition duration-150 ease-in-out mt-4 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Image
            src="/assets/devicon_google.svg"
            alt="Google logo"
            width={24}
            height={24}
            className="size-6 object-contain"
          />
          <span>Sign-in with Google</span>
        </button> */}

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked);
                if (!e.target.checked) {
                  localStorage.removeItem(STORAGE_KEYS.REMEMBER_IDENTIFIER);
                }
              }}
              className="size-4 text-[#6cc200] bg-gray-100 border-gray-300 rounded focus:ring-[#6cc200] focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-orange-500 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 lg:hidden">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#21a84f] font-semibold hover:underline">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
}
