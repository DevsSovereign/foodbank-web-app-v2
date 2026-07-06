"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useSupportChat } from "@/hooks/useSupportChat";

export default function SetPinPage() {
  const { toast } = useToast();
  const { open: openSupport, isLoggedIn } = useSupportChat();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1); // 1: initial, 2: confirm, 3: success
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const confirmRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePinChange = (index: number, value: string, isConfirm: boolean) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const currentPin = isConfirm ? confirmPin : pin;
    const currentRefs = isConfirm ? confirmRefs : pinRefs;
    const setter = isConfirm ? setConfirmPin : setPin;

    const newPin = [...currentPin];
    newPin[index] = value;
    setter(newPin);

    if (value !== "" && index < 3) {
      currentRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean,
  ) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const currentRefs = isConfirm ? confirmRefs : pinRefs;

    if (e.key === "Backspace" && currentPin[index] === "" && index > 0) {
      currentRefs[index - 1].current?.focus();
    }
  };

  const handleNext = () => {
    if (step === 1 && pin.every((digit) => digit !== "")) {
      setStep(2);
    } else if (step === 2 && confirmPin.every((digit) => digit !== "")) {
      if (pin.join("") === confirmPin.join("")) {
        setStep(3);
      } else {
        toast({ variant: "error", title: "PINs do not match. Please try again." });
        setConfirmPin(["", "", "", ""]);
        confirmRefs[0].current?.focus();
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/account/personal-details"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to Personal Details</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        {step < 3 ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {step === 1 ? "Set up your PIN" : "Confirm your PIN"}
              </h1>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {step === 1
                  ? "Create a 4-digit PIN to secure your account and authorize transactions."
                  : "Please re-enter your 4-digit PIN to confirm."}
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              {(step === 1 ? pin : confirmPin).map((digit, index) => (
                <input
                  key={index}
                  ref={(step === 1 ? pinRefs : confirmRefs)[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, step === 2)}
                  onKeyDown={(e) => handleKeyDown(index, e, step === 2)}
                  className="size-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!(step === 1 ? pin : confirmPin).every((digit) => digit !== "")}
              className="w-full bg-[#8cc629] hover:bg-[#7db424] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              {step === 1 ? "Continue" : "Confirm PIN"}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="size-10 text-[#8cc629]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">PIN Set Successfully!</h1>
            <p className="text-gray-500 text-sm mb-10 max-w-xs mx-auto">
              Your security PIN has been created. You can now use it to authorize transactions and
              secure your account.
            </p>
            <Link
              href="/dashboard/account/personal-details"
              className="inline-block w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-sm"
            >
              Done
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          If you&apos;re having trouble, please contact our{" "}
          {isLoggedIn && (
            <button
              type="button"
              onClick={openSupport}
              className="text-[#8cc629] hover:underline"
            >
              Support Team
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
