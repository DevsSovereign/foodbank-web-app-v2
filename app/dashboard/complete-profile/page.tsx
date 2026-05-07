"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

/** Stored user shape from login response. */
interface StoredUser {
  id: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
  });

  // Pre-populate from stored user data
  useEffect(() => {
    const stored = localStorage.getItem("fb4u_user");
    if (stored) {
      try {
        const user: StoredUser = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        }));
      } catch {
        // Ignore corrupt data
      }
    }
  }, []);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  /** Client-side validation. */
  const validate = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phoneNumber.trim()) return "Phone number is required";
    if (!formData.deliveryAddress.trim()) return "Delivery address is required";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Wire to profile-completion endpoint when provided
      // await profileService.completeProfile(formData);

      // For now, update stored user with the new data
      const stored = localStorage.getItem("fb4u_user");
      if (stored) {
        const user = JSON.parse(stored);
        const updated = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          deliveryAddress: formData.deliveryAddress,
          isComplete: "complete",
        };
        localStorage.setItem("fb4u_user", JSON.stringify(updated));
      }

      setSuccessMessage("Profile completed successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-[20px] font-bold text-gray-900 mb-8 uppercase tracking-wide">
        PERSONAL INFORMATION
      </h1>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => handleChange("deliveryAddress", e.target.value)}
                placeholder="Enter your delivery address"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email (read-only, already verified) */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              E-mail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full pl-12 pr-12 py-3 bg-[#F3F4F6] border border-gray-100 rounded-[12px] text-[15px] focus:outline-none text-gray-600"
              />
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#8cc629]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 pb-10">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full max-w-[400px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
