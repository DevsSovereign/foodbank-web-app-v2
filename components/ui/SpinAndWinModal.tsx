"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";

type ModalState = "unlocked" | "spinning" | "won";

interface SpinAndWinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpinAndWinModal({ isOpen, onClose }: SpinAndWinModalProps) {
  const [modalState, setModalState] = useState<ModalState>("unlocked");
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModalState("unlocked");
    setRotation(0);
    setIsAnimating(false);
  }, [isOpen]);

  const handleSpin = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setModalState("spinning");

    // Rotate 5-8 full turns + random offset to land on "Face Cap" (top) or other segments
    // Orange Face Cap is at 0 degrees (top)
    const extraDegrees = 0; // Landing on Face Cap for now as per screenshot example
    const totalRotation = rotation + 360 * 5 + extraDegrees;
    setRotation(totalRotation);

    setTimeout(() => {
      setIsAnimating(false);
      setModalState("won");
    }, 3000); // 3 seconds spinning
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto">
      <div className="relative p-6 md:p-8 max-w-[440px] w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300 my-4">
        {/* Close Button */}
        <div className="flex justify-end mb-2 w-full relative">
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <XCircle className="size-8" strokeWidth={1.5} />
          </button>
        </div>

        {modalState === "unlocked" && (
          <>
            <div className="mb-1">
              <span className="text-[36px]">🎉</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-extrabold text-white mb-1 leading-tight tracking-tight">
              Congratulations!
            </h2>
            <h3 className="text-[18px] md:text-[22px] font-bold text-white mb-2 tracking-tight">
              You&apos;ve unlocked a Spin & Win!
            </h3>
            <p className="text-white/90 text-[13px] md:text-[14px] mb-5 max-w-[340px] leading-relaxed italic mx-auto">
              As a thank you for your purchase, spin the wheel
              <br />
              for a chance to win a gift on your last order.
            </p>
          </>
        )}

        {modalState === "spinning" && (
          <>
            <div className="mb-2">
              <span className="text-[32px]">🔥</span>
            </div>
            <h2 className="text-[26px] md:text-[32px] font-bold text-white mb-2">Spinning...</h2>
            <p className="text-white/80 text-[15px] mb-4">Hold tight! Your luck is in motion...</p>
          </>
        )}

        {modalState === "won" && (
          <>
            <div className="mb-2">
              <span className="text-[36px]">🎊</span>
            </div>
            <h2 className="text-[26px] md:text-[32px] font-bold text-white mb-1">
              Congratulations!
            </h2>
            <p className="text-[22px] md:text-[26px] font-bold text-[#a4e644] mb-5 uppercase tracking-wider drop-shadow-sm">
              You&apos;ve won a Free Face Cap
            </p>
          </>
        )}

        {/* The Wheel/Prize Reveal Area */}
        <div className="relative size-[300px] md:w-[340px] md:h-[340px] mb-6 flex items-center justify-center">
          {modalState !== "won" ? (
            <div
              className="relative size-full transition-transform duration-[3000ms] cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Wheel Background - Custom SVG structure */}
              <svg viewBox="0 0 100 100" className="size-full drop-shadow-2xl">
                {/* Segments matching exact 45-degree offset */}
                <g transform="rotate(-45 50 50)">
                  <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="#FF8A3D" />{" "}
                  {/* Top - Orange */}
                  <path d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z" fill="#FFFBF5" />{" "}
                  {/* Right - White */}
                  <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill="#FF8A3D" />{" "}
                  {/* Bottom - Orange */}
                  <path d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z" fill="#FFFBF5" />{" "}
                  {/* Left - White */}
                </g>

                {/* Thick glowing/styled border similar to the required design */}
                <circle cx="50" cy="50" r="49" fill="none" stroke="#000000" strokeWidth="2" />
                <circle cx="50" cy="50" r="46.5" fill="none" stroke="#FFF0C2" strokeWidth="5" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#000000" strokeWidth="1.5" />

                {/* Decorative dots on ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <circle
                    key={deg}
                    cx={50 + 46.5 * Math.cos((deg * Math.PI) / 180)}
                    cy={50 + 46.5 * Math.sin((deg * Math.PI) / 180)}
                    r="2"
                    fill="#C6AF6B"
                  />
                ))}
              </svg>

              {/* Labels and Icons on the wheel */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Quadrant 1 (Top) - Face Cap */}
                <div className="absolute top-1/2 left-1/2 flex flex-col items-center -mt-[80px] md:-mt-[95px] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative size-12 md:w-14 md:h-14 mb-1">
                    <Image
                      src="/stylish-gray-cap-with-distinct-stitching-details-on-a-minimalist-background-photo-removebg-preview-1.png"
                      alt="Face Cap"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide">
                    Face Cap
                  </span>
                </div>

                {/* Quadrant 2 (Right) - T-shirt */}
                <div className="absolute top-1/2 left-1/2 flex flex-col items-center ml-[80px] md:ml-[95px] -translate-x-1/2 -translate-y-1/2 rotate-90">
                  <div className="relative size-12 md:w-14 md:h-14 mb-1">
                    <Image
                      src="/screenshot_20260109081525-removebg-preview-1.png"
                      alt="T-shirt"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-bold text-gray-900 tracking-wide">
                    T-shirt
                  </span>
                </div>

                {/* Quadrant 3 (Bottom) - Mug Cup */}
                <div className="absolute top-1/2 left-1/2 flex flex-col items-center mt-[80px] md:mt-[95px] -translate-x-1/2 -translate-y-1/2 rotate-180">
                  <div className="relative size-12 md:w-14 md:h-14 mb-1">
                    <Image
                      src="/screenshot_20260113165210-removebg-preview-1.png"
                      alt="Mug Cup"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide">
                    Mug Cup
                  </span>
                </div>

                {/* Quadrant 4 (Left) - Singlet */}
                <div className="absolute top-1/2 left-1/2 flex flex-col items-center -ml-[80px] md:-ml-[95px] -translate-x-1/2 -translate-y-1/2 -rotate-90">
                  <div className="relative size-12 md:w-14 md:h-14 mb-1">
                    <Image
                      src="/screenshot_20251212042158-removebg-preview-1.png"
                      alt="Singlet"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] md:text-[12px] font-bold text-gray-900 tracking-wide">
                    Singlet
                  </span>
                </div>
              </div>

              {/* Center Emoji */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 bg-white rounded-full flex items-center justify-center text-[28px] border-[3px] border-[#FFF0C2] z-10 shadow-sm">
                🤗
              </div>
            </div>
          ) : (
            /* Winning Gift Box */
            <div className="relative size-full animate-in zoom-in duration-500 flex flex-col items-center justify-center">
              <div className="relative size-64 md:w-80 md:h-80">
                <Image
                  src="/pngtree-the-cute-gift-box-was-opened-png-image_12862611-removebg-preview-1.png"
                  alt="Opened Gift Box"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Wheel Pin/Pointer */}
          {modalState !== "won" && (
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-12 z-20 hover:scale-105 transition-transform cursor-pointer"
              onClick={handleSpin}
            >
              <svg viewBox="0 0 24 30" fill="none" className="size-full drop-shadow-lg">
                <path
                  d="M12 30L0 10C0 4.47715 4.47715 0 12 0C19.5228 0 24 4.47715 24 10L12 30Z"
                  fill="#FFFBEB"
                  stroke="#D4C9A0"
                  strokeWidth="1"
                />
                <circle cx="12" cy="10" r="4" fill="#D4D4D4" />
              </svg>
            </div>
          )}
        </div>

        {/* Footer Info & Action Button */}
        <div className="w-full max-w-[320px] mx-auto">
          {modalState !== "won" ? (
            <>
              <button
                onClick={handleSpin}
                disabled={isAnimating}
                className={`w-full ${isAnimating ? "bg-gray-300" : "bg-[#8cc629] hover:bg-[#7db424]"} text-white font-bold py-3.5 rounded-xl text-[18px] transition-all shadow-md tracking-wide mb-4`}
              >
                {modalState === "spinning" ? "Spinning..." : "Spin"}
              </button>
              <p className="text-[12px] md:text-[13px] text-white/80 font-medium leading-relaxed italic">
                Every purchase above ₦30,000 gives you a spin. Reward selected will be added to your
                item.
              </p>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-3.5 rounded-xl text-[18px] transition-all shadow-lg shadow-black/20 tracking-wide mb-4 active:scale-95"
              >
                Claim Reward
              </button>
              <p className="text-[13px] text-white/80 leading-relaxed italic">
                Thank you for shopping with us! Your gift will be added to your current order over
                ₦30,000.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
