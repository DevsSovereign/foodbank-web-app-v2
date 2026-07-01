"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import LoaderSection from "./Loader";

/** A normalized segment on the wheel. `raw` carries the source object so the
 * parent can rebuild its own claim payload after a win. */
export interface WheelItem<T = unknown> {
  id: string;
  image: string;
  label: string;
  isActive: boolean;
  raw: T;
}

interface SpinWheelModalProps<T> {
  open: boolean;
  items: WheelItem<T>[];
  isLoading?: boolean;
  isClaiming?: boolean;
  onClose: () => void;
  onClaim: (wonItem: WheelItem<T>) => void;
  title?: string;
  subtitle?: string;
  description?: string;
  idleFooter?: string;
  wonFooter?: string;
}

type WheelState = "idle" | "spinning" | "braking" | "won";

const SPIN_SPEED = 0.7; // degrees per millisecond while free-spinning
const BRAKE_MS = 4500; // how long the ease-out brake lasts
const BRAKE_TURNS = 5; // extra full turns added during the brake

export default function SpinWheelModal<T>({
  open,
  items,
  isLoading = false,
  isClaiming = false,
  onClose,
  onClaim,
  title = "Congratulations!",
  subtitle = "You've unlocked a Spin & Win!",
  description = "As a thank you for your purchase, spin the wheel for a chance to win a gift on your order.",
  idleFooter = "Spin the wheel to reveal your reward. Reward selected will be added to your item.",
  wonFooter = "Thank you for shopping with us! Your gift will be added to your current order.",
}: SpinWheelModalProps<T>) {
  const [wheelState, setWheelState] = useState<WheelState>("idle");
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const brakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const segmentCount = items.length;
  const segmentAngle = segmentCount > 0 ? 360 / segmentCount : 0;
  const wonItem = winnerIndex != null ? items[winnerIndex] : undefined;

  // Convert an angle (clockwise from the top) into SVG coordinates on a 100x100 viewBox.
  const polarToSvg = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
  };

  const setWheelTransform = (deg: number) => {
    if (wheelRef.current) wheelRef.current.style.transform = `rotate(${deg}deg)`;
  };

  const stopRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  // Constant-speed free spin, driven directly via the ref to avoid re-renders.
  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = ts - lastTsRef.current;
    lastTsRef.current = ts;
    rotationRef.current += SPIN_SPEED * dt;
    setWheelTransform(rotationRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleSpin = () => {
    if (segmentCount === 0) return;
    setWheelState("spinning");
    if (wheelRef.current) wheelRef.current.style.transition = "none";
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleStop = () => {
    if (segmentCount === 0) return;
    stopRaf();
    setWheelState("braking");

    // Pick the winner, then ease-out to align its segment under the top pointer.
    const winner = Math.floor(Math.random() * segmentCount);
    const current = rotationRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    const targetMod = (((-winner * segmentAngle) % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const final = current + 360 * BRAKE_TURNS + delta;

    rotationRef.current = final;
    setWinnerIndex(winner);

    // Apply the braking transition on the next frame so it animates from the
    // current angle (like easing off a brake — quick at first, then gentle).
    requestAnimationFrame(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = `transform ${BRAKE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        wheelRef.current.style.transform = `rotate(${final}deg)`;
      }
    });

    brakeTimeoutRef.current = setTimeout(() => setWheelState("won"), BRAKE_MS);
  };

  const handleClaim = () => {
    const prize = winnerIndex != null ? items[winnerIndex] : items[0];
    if (prize) onClaim(prize);
  };

  // Reset everything whenever the modal opens; tear down timers when it closes.
  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWheelState("idle");
    setWinnerIndex(null);
    rotationRef.current = 0;
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }

    return () => {
      stopRaf();
      if (brakeTimeoutRef.current) clearTimeout(brakeTimeoutRef.current);
    };
  }, [open]);

  if (!open) return null;

  const isSpinningOrBraking = wheelState === "spinning" || wheelState === "braking";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto">
      {isLoading || segmentCount === 0 ? (
        <LoaderSection />
      ) : (
        <div className="relative p-6 md:p-8 max-w-[440px] w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300 my-4">
          {/* Close Button */}
          <div className="flex justify-end mb-2 w-full relative">
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <XCircle className="size-8" strokeWidth={1.5} />
            </button>
          </div>

          {wheelState === "idle" && (
            <>
              <div className="mb-1">
                <span className="text-[36px]">🎉</span>
              </div>
              <h2 className="text-[26px] md:text-[30px] font-extrabold text-white mb-1 leading-tight tracking-tight">
                {title}
              </h2>
              <h3 className="text-[18px] md:text-[22px] font-bold text-white mb-2 tracking-tight">
                {subtitle}
              </h3>
              <p className="text-white/90 text-[13px] md:text-[14px] mb-5 max-w-[340px] leading-relaxed italic mx-auto">
                {description}
              </p>
            </>
          )}

          {isSpinningOrBraking && (
            <>
              <div className="mb-2">
                <span className="text-[32px]">🔥</span>
              </div>
              <h2 className="text-[26px] md:text-[32px] font-bold text-white mb-2">
                {wheelState === "braking" ? "Stopping..." : "Spinning..."}
              </h2>
              <p className="text-white/80 text-[15px] mb-4">
                {wheelState === "braking"
                  ? "Slowing down — let's see where it lands!"
                  : "Hold tight! Press Stop whenever you're ready."}
              </p>
            </>
          )}

          {wheelState === "won" && (
            <>
              <div className="mb-2">
                <span className="text-[36px]">🎊</span>
              </div>
              <h2 className="text-[26px] md:text-[32px] font-bold text-white mb-1">{title}</h2>
              <p className="text-[22px] md:text-[26px] font-bold text-[#a4e644] mb-5 uppercase tracking-wider drop-shadow-sm">
                {wonItem ? `You've won ${wonItem.label}` : "You've won a prize"}
              </p>
            </>
          )}

          {/* The Wheel / Prize Reveal Area */}
          <div className="relative size-[300px] md:w-[340px] md:h-[340px] mb-6 flex items-center justify-center">
            {wheelState !== "won" ? (
              <div ref={wheelRef} className="relative size-full">
                {/* Wheel Background - one wedge per prize */}
                <svg viewBox="0 0 100 100" className="size-full drop-shadow-2xl">
                  {items.map((item, i) => {
                    const start = polarToSvg(i * segmentAngle - segmentAngle / 2, 50);
                    const end = polarToSvg(i * segmentAngle + segmentAngle / 2, 50);
                    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                    return (
                      <path
                        key={item.id}
                        d={`M 50 50 L ${start.x} ${start.y} A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`}
                        fill={i % 2 === 0 ? "#FF8A3D" : "#FFFBF5"}
                      />
                    );
                  })}

                  <circle cx="50" cy="50" r="49" fill="none" stroke="#000000" strokeWidth="2" />
                  <circle cx="50" cy="50" r="46.5" fill="none" stroke="#FFF0C2" strokeWidth="5" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#000000" strokeWidth="1.5" />

                  {items.map((item, i) => {
                    const dot = polarToSvg(i * segmentAngle - segmentAngle / 2, 46.5);
                    return (
                      <circle key={`dot-${item.id}`} cx={dot.x} cy={dot.y} r="2" fill="#C6AF6B" />
                    );
                  })}
                </svg>

                {/* Prize images on the wheel */}
                <div className="absolute inset-0 pointer-events-none">
                  {items.map((item, i) => {
                    const angle = i * segmentAngle;
                    const rad = ((angle - 90) * Math.PI) / 180;
                    const left = 50 + 0.62 * 50 * Math.cos(rad);
                    const top = 50 + 0.62 * 50 * Math.sin(rad);
                    return (
                      <div
                        key={`img-${item.id}`}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        }}
                      >
                        <div className="relative size-12 md:w-14 md:h-14">
                          <Image
                            src={item.image}
                            alt={item.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Center Emoji */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 bg-white rounded-full flex items-center justify-center text-[28px] border-[3px] border-[#FFF0C2] z-10 shadow-sm">
                  🤗
                </div>
              </div>
            ) : (
              /* Winning Prize Reveal */
              <div className="relative size-full animate-in zoom-in duration-500 flex flex-col items-center justify-center">
                <div className="relative size-64 md:w-80 md:h-80">
                  <Image
                    src={
                      wonItem?.image ??
                      "/pngtree-the-cute-gift-box-was-opened-png-image_12862611-removebg-preview-1.png"
                    }
                    alt={wonItem?.label ?? "Prize"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Wheel Pin / Pointer */}
            {wheelState !== "won" && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-12 z-20">
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
            {wheelState === "won" ? (
              <>
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full bg-[#8cc629] disabled:opacity-70 hover:bg-[#7db424] text-white font-bold py-3.5 rounded-xl text-[18px] transition-all shadow-lg shadow-black/20 tracking-wide mb-4 active:scale-95"
                >
                  {isClaiming ? "Claiming..." : "Claim it!"}
                </button>
                <p className="text-[13px] text-white/80 leading-relaxed italic">{wonFooter}</p>
              </>
            ) : (
              <>
                <button
                  onClick={wheelState === "idle" ? handleSpin : handleStop}
                  disabled={wheelState === "braking"}
                  className={`w-full ${wheelState === "braking" ? "bg-gray-300" : "bg-[#8cc629] hover:bg-[#7db424]"} text-white font-bold py-3.5 rounded-xl text-[18px] transition-all shadow-md tracking-wide mb-4`}
                >
                  {wheelState === "idle"
                    ? "Spin"
                    : wheelState === "spinning"
                      ? "Stop"
                      : "Stopping..."}
                </button>
                <p className="text-[12px] md:text-[13px] text-white/80 font-medium leading-relaxed italic">
                  {idleFooter}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
