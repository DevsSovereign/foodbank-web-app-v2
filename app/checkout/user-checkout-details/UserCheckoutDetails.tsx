"use client";

import { User, MapPin, Phone, ChevronRight, Edit } from "lucide-react";
import type { UserResponse } from "@/types/user";
import type { CustomerMode } from "@/types/cart";
import { useGetPickupLocation } from "@/lib/queries";

interface UserCheckoutDetailsProps {
  user: UserResponse | null;
  customerAddress: string;
  customerPhone: string;
  selectedPickupDate: Date | null;
  customerMode: CustomerMode | null;
  onCustomerModeChange: (mode: CustomerMode) => void;
  onEditCustomer: () => void;
  onEditPhone: () => void;
  onPickDate: () => void;
}

const DELIVERY_METHODS: { mode: CustomerMode; label: string }[] = [
  { mode: "home-delivery", label: "Home Delivery" },
  { mode: "pickup", label: "Store Pick-up" },
];

export default function UserCheckoutDetails({
  user,
  customerAddress,
  customerPhone,
  selectedPickupDate,
  customerMode,
  onCustomerModeChange,
  onEditCustomer,
  onEditPhone,
  onPickDate,
}: UserCheckoutDetailsProps) {
  const { data: pickupLocation } = useGetPickupLocation({
    enabled: customerMode === "pickup" && !!selectedPickupDate,
  });

  return (
    <>
      {/* Customer Details Card */}
      <div className="bg-white border text-center md:text-left border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <h2 className="text-[20px] font-bold text-gray-800">Customer Details</h2>
          <button
            onClick={onEditCustomer}
            className="text-[#8cc629] text-[13px] font-medium flex items-center gap-1 hover:underline"
          >
            Edit Customer Address <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {user && (
            <div className="flex items-center gap-3">
              <User className="text-[#8cc629] w-4.5 h-4.5" />
              <span className="text-gray-700 text-sm">{`${user.firstName} ${user.lastName}`}</span>
            </div>
          )}
          <div className="flex items-start gap-3">
            <MapPin className="text-[#8cc629] w-4.5 h-4.5 mt-0.5" />
            <span className="text-gray-700 text-sm">{customerAddress}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-[#8cc629] w-4.5 h-4.5" />
            {user?.phoneNumber ? (
              <span className="text-gray-700 text-sm font-medium">{user.phoneNumber}</span>
            ) : (
              <button
                onClick={onEditPhone}
                className="text-[#8cc629] font-medium text-sm hover:underline"
              >
                Add Phone number
              </button>
            )}
          </div>

          {user?.phoneNumber &&
            (customerPhone ? (
              <div className="flex items-center gap-3">
                <Phone className="text-[#8cc629] w-4.5 h-4.5" />
                <div className="flex flex-row items-center gap-1">
                  <span className="text-gray-700 text-sm font-medium">{customerPhone}</span>
                  <button type="button" onClick={onEditPhone}>
                    <Edit className="w-4 h-4 text-[#8cc629]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Phone className="text-[#8cc629] w-4.5 h-4.5" />
                <button
                  onClick={onEditPhone}
                  className="text-[#8cc629] font-medium text-sm hover:underline"
                >
                  Add second phone number
                </button>
              </div>
            ))}
        </div>

        <div className="bg-[#fff5f5] text-[#ff8080] py-3 px-5 rounded-md text-[13px] font-medium inline-block w-full">
          Ensure numbers are reachable at delivery to avoid cancellation or extra fees
        </div>
      </div>

      {/* Delivery Method Card */}
      <div className="bg-white border border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <h2 className="text-[20px] font-bold text-gray-800">Delivery Method</h2>
          {customerMode && (
            <button
              onClick={onPickDate}
              className="text-[#8cc629] text-[13px] font-medium flex items-center gap-1 hover:underline"
            >
              Set a date from today upward <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DELIVERY_METHODS.map(({ mode, label }) => {
            const isSelected = customerMode === mode;

            return (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onCustomerModeChange(mode)}
                className={`flex items-center gap-3 px-5 py-4 rounded-md border text-left transition-colors ${
                  isSelected
                    ? "border-[#8cc629] bg-[#f4faee]"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? "border-4 border-[#8cc629]" : "border border-gray-300"
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#8cc629]" />}
                </span>
                <span className="text-sm font-medium text-gray-800">{label}</span>
              </button>
            );
          })}
        </div>

        {selectedPickupDate && (
          <div className="mt-4 border border-[#8cc629] bg-[#f4faee] rounded-md py-4 flex flex-col items-center justify-center text-center">
            <p className="text-gray-800 font-bold text-sm">
              {selectedPickupDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {customerMode === "pickup" && selectedPickupDate && pickupLocation && (
          <div className="mt-4 border border-[#8cc629] bg-[#f4faee] rounded-md p-4 space-y-2.5">
            <p className="text-gray-800 font-bold text-sm text-center">
              {pickupLocation.data.storeName}
            </p>

            <div className="flex items-start justify-center gap-2">
              <MapPin className="text-[#8cc629] w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-gray-700 text-xs">{pickupLocation.data.address}</span>
            </div>

            {pickupLocation.data.contactInfo && (
              <div className="flex items-center justify-center gap-2">
                <Phone className="text-[#8cc629] w-4 h-4 shrink-0" />
                <span className="text-gray-700 text-xs">{pickupLocation.data.contactInfo}</span>
              </div>
            )}

            {pickupLocation.data.mapLink && (
              <a
                href={pickupLocation.data.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8cc629] text-xs font-medium flex items-center justify-center gap-1 hover:underline"
              >
                View on map <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
