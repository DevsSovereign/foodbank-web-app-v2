"use client";

import React from "react";
import Image from "next/image";

interface BNPLSuccessModalProps {
  isOpen: boolean;
  onDone: () => void;
}

export default function BNPLSuccessModal({ isOpen, onDone }: BNPLSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-[360px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Success Image */}
        <div className="relative size-20 mb-4">
          <Image
            src="/assets/screenshot_20251212042158-removebg-preview-1.png"
            alt="Success"
            fill
            className="object-contain"
          />
        </div>

        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
          Submission Successful
        </h2>

        <p className="text-gray-500 text-[13px] md:text-[14px] mb-6 leading-relaxed px-2">
          Your submission has been received and is currently under review. We&apos;ll notify you
          once the review is complete.
        </p>

        <button
          onClick={onDone}
          className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-3 rounded-[12px] text-[16px] transition-all active:scale-95 shadow-md uppercase tracking-wide"
        >
          Done
        </button>
      </div>
    </div>
  );
}
