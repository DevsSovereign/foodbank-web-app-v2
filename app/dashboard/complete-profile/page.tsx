"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useUserStore } from "@/store/useUserStore";
import { handleError } from "@/lib/handle-error";
import { userService } from "@/lib/services/user.service";
import { autocompletePlaces } from "@/functions/locationAutoComplete";
import { useGetCustomer } from "@/lib/queries";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";

type PlaceSuggestion = {
  placeId: string;
  text: string;
  secondaryText?: string;
};

export default function CompleteProfilePage() {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    deliveryAddress: user?.deliveryAddress ?? "",
  });
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState<boolean>(false);
  const addressWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef<number>(0);
  const { toast } = useToast();
  const router = useRouter();
  const { refetch: refetchUserProfile } = useGetCustomer();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleAddressChange = (value: string) => {
    handleChange("deliveryAddress", value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      setIsFetchingSuggestions(false);
      return;
    }

    setIsFetchingSuggestions(true);
    setIsSuggestOpen(true);

    debounceRef.current = setTimeout(async () => {
      const reqId = ++requestIdRef.current;
      try {
        const results = await autocompletePlaces({
          input: value,
          apiKey: GOOGLE_MAPS_API_KEY,
        });
        if (reqId !== requestIdRef.current) return;
        setSuggestions(results);
        setIsSuggestOpen(true);
      } catch {
        if (reqId !== requestIdRef.current) return;
        setSuggestions([]);
      } finally {
        if (reqId === requestIdRef.current) setIsFetchingSuggestions(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (s: PlaceSuggestion) => {
    const full = s.secondaryText ? `${s.text}, ${s.secondaryText}` : s.text;
    handleChange("deliveryAddress", full);
    setSuggestions([]);
    setIsSuggestOpen(false);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (addressWrapperRef.current && !addressWrapperRef.current.contains(e.target as Node)) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
      return setError(validationError);
    }

    setIsLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.deliveryAddress,
      deliveryAddress: formData.deliveryAddress,
      phoneNumber: formData.phoneNumber,
    };

    try {
      const res = await userService.updateProfile(payload);
      const { data: userProfile } = await refetchUserProfile();
      if (!userProfile) return;

      setUser(userProfile.customer);
      toast({ variant: "success", title: res.message || "Profile completed successfully!" });
      router.replace("/dashboard");
    } catch (error) {
      handleError(error);
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

      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm mb-8">
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
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
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
                readOnly
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
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
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={addressWrapperRef}>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 z-10" />
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setIsSuggestOpen(true);
                }}
                autoComplete="off"
                placeholder="Enter your delivery address"
                className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 disabled:opacity-60"
              />

              {isFetchingSuggestions && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#8cc629] animate-spin" />
              )}

              {isSuggestOpen && (suggestions.length > 0 || isFetchingSuggestions) && (
                <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                  {suggestions.length === 0 && isFetchingSuggestions ? (
                    <div className="flex items-center gap-2 px-4 py-3 text-[14px] text-gray-500">
                      <Loader2 className="size-4 animate-spin text-[#8cc629]" />
                      Searching addresses...
                    </div>
                  ) : (
                    <ul className="max-h-64 overflow-y-auto py-1">
                      {suggestions.map((s) => (
                        <li key={s.placeId}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(s)}
                            className="w-full flex items-start gap-3 text-left px-4 py-3 hover:bg-[#8cc629]/10 transition-colors group"
                          >
                            <MapPin className="size-4 text-gray-400 group-hover:text-[#8cc629] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[14px] font-medium text-gray-700 truncate">
                                {s.text}
                              </p>
                              {s.secondaryText && (
                                <p className="text-[12px] text-gray-500 truncate">
                                  {s.secondaryText}
                                </p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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
                className="w-full pl-12 pr-12 py-3 bg-[#F3F4F6] border border-gray-100 rounded-xl text-[15px] focus:outline-none text-gray-600"
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
          className="w-full max-w-100 bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-xl text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
