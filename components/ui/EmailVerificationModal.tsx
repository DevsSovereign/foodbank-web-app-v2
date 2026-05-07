"use client";

import Image from "next/image";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  onProceed,
}: EmailVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[40px] p-10 max-w-[450px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="relative size-28 mb-6">
          <Image src="/assets/screenshot-2.png" alt="Oops emoji" fill className="object-contain" />
        </div>

        <h2 className="text-[32px] font-bold text-gray-900 mb-4">Oops!</h2>

        <p className="text-gray-600 text-[18px] mb-10 leading-relaxed max-w-[340px]">
          Please verify your email address in your profile to access the Buy Now, Pay Later feature.
        </p>

        <div className="flex gap-4 w-full">
          <button
            className="flex-1 bg-[#BDBDBD] hover:bg-[#A0A0A0] text-white font-bold py-4 rounded-[20px] text-[20px] transition-all active:scale-95 shadow-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[20px] text-[20px] transition-all active:scale-95 shadow-sm"
            onClick={onProceed}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
