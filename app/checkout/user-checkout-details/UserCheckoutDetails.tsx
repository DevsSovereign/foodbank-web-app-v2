"use client";

import { User, MapPin, Phone, ChevronRight, Edit } from "lucide-react";
import type { UserResponse } from "@/types/user";

interface UserCheckoutDetailsProps {
  user: UserResponse | null;
  customerAddress: string;
  customerPhone: string;
  selectedDeliveryDate: Date;
  onEditCustomer: () => void;
  onEditPhone: () => void;
  onPickDate: () => void;
}

export default function UserCheckoutDetails({
  user,
  customerAddress,
  customerPhone,
  selectedDeliveryDate,
  onEditCustomer,
  onEditPhone,
  onPickDate,
}: UserCheckoutDetailsProps) {
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
              <div className="flex flex-row items-center gap-1">
                <span className="text-gray-700 text-sm font-medium">
                  {customerPhone || user?.phoneNumber}
                </span>
                <button type="button" onClick={onEditPhone}>
                  <Edit className="w-4 h-4 text-[#8cc629]" />
                </button>
              </div>
            ) : (
              <button
                onClick={onEditPhone}
                className="text-[#8cc629] font-medium text-sm hover:underline"
              >
                Add Phone number
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#fff5f5] text-[#ff8080] py-3 px-5 rounded-md text-[13px] font-medium inline-block w-full">
          Ensure numbers are reachable at delivery to avoid cancellation or extra fees
        </div>
      </div>

      {/* Delivery Details Card */}
      <div className="bg-white border border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <h2 className="text-[20px] font-bold text-gray-800">Delivery Details</h2>
          <button
            onClick={onPickDate}
            className="text-[#8cc629] text-[13px] font-medium flex items-center gap-1 hover:underline"
          >
            Set a date from today upward <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {selectedDeliveryDate ? (
          <div className="border border-[#8cc629] bg-[#f4faee] rounded-md py-6 flex flex-col items-center justify-center text-center">
            <p className="text-gray-800 font-bold mb-1.5">
              {selectedDeliveryDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-500 text-xs">Door Delivery</p>
          </div>
        ) : (
          <div className="border border-dashed border-[#e6e6e6] bg-[#fafafa] rounded-md py-8 flex flex-col items-center justify-center text-center">
            <p className="text-gray-700 text-sm font-medium mb-1.5">Select a day upward from today</p>
            <p className="text-gray-400 text-xs shadow-sm">Door Delivery</p>
          </div>
        )}
      </div>
    </>
  );
}
