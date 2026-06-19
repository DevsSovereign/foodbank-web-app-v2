"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { useGetSpinItems } from "@/lib/queries";
import LoaderSection from "./Loader";
import { STORAGE_KEYS } from "@/lib/auth-utils";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";
import { handleError } from "@/lib/handle-error";
import { ClaimGamificationPayload } from "@/types/user";
import { useToast } from "./toast/ToastProvider";

type ModalState = "unlocked" | "spinning" | "won";

interface SpinAndWinModalProps {
  open: boolean;
  /** Dismiss without claiming (e.g. the ✕ button). */
  onClose: () => void;
  /** Claim the reward — advances to the next eligible modal. */
  onClaim: () => void;
}

export default function SpinAndWinModal({ open, onClose, onClaim }: SpinAndWinModalProps) {
  const [modalState, setModalState] = useState<ModalState>("unlocked");
  const [rotation, setRotation] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: spinItems, isLoading: spinItemsLoading } = useGetSpinItems();

  // claim mutation
  const { isPending: isClaiming, mutate: claimMutation } = useMutation({
    mutationFn: userService.claimGamification,
    onSuccess: () => onClaim(),
    onError: (error) => {
      const message = handleError(error);
      toast({ variant: "error", title: message });
    },
  });

  // The actual prizes on the wheel, one segment per function.
  const items = spinItems?.functions ?? [];
  const segmentCount = items.length;
  const segmentAngle = segmentCount > 0 ? 360 / segmentCount : 0;
  const wonItem = winnerIndex != null ? items[winnerIndex]?.scopeId : undefined;

  const formatPrize = (scope: string, value: number) => {
    return scope === "Fixed Amount" ? `₦${value.toLocaleString()} Off` : `${value}% Off`;
  };

  // Convert an angle (clockwise from the top) into SVG coordinates on a 100x100 viewBox.
  const polarToSvg = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
  };

  const handleSpin = () => {
    if (isAnimating || segmentCount === 0) return;

    setIsAnimating(true);
    setModalState("spinning");

    // Pick a random prize, then rotate so its segment stops under the top pointer.
    const winner = Math.floor(Math.random() * segmentCount);
    const currentMod = ((rotation % 360) + 360) % 360;
    const targetMod = (((-winner * segmentAngle) % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const totalRotation = rotation + 360 * 5 + delta;

    setRotation(totalRotation);
    setWinnerIndex(winner);

    setTimeout(() => {
      setIsAnimating(false);
      setModalState("won");
      // Persist the won prize so it can be applied/claimed later.
      sessionStorage.setItem(STORAGE_KEYS.SPINNED_ITEM, JSON.stringify(items[winner]));
    }, 3000); // 3 seconds spinning
  };

  const handleOnClaim = () => {
    const wonItem = winnerIndex !== null ? items[winnerIndex].scopeId : items[0].scopeId;
    const isDiscount = wonItem.scope.includes("discount".toLowerCase());

    const payload: ClaimGamificationPayload = {
      orderId: wonItem._id,
      reward: wonItem.scope,
      rewardType: "discountSpin",
      expiresAt: "",
      status: wonItem.isActive ? "active" : "",
      discountSpinBonus: wonItem.scope === "Fixed Amount" ? wonItem.value : undefined,
      discountSpinDiscount: isDiscount ? wonItem.value : undefined,
    };

    claimMutation(payload);
  };

  // Reset state when modal opens
  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModalState("unlocked");
    setRotation(0);
    setIsAnimating(false);
    setWinnerIndex(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto">
      {!spinItems || spinItemsLoading ? (
        <LoaderSection />
      ) : (
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
              <p className="text-white/80 text-[15px] mb-4">
                Hold tight! Your luck is in motion...
              </p>
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
                {wonItem
                  ? `You've won ${formatPrize(wonItem.scope, wonItem.value)}`
                  : "You've won a prize"}
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
                {/* Wheel Background - one wedge per prize */}
                <svg viewBox="0 0 100 100" className="size-full drop-shadow-2xl">
                  {items.map((item, i) => {
                    // Each wedge is centered on the angle where its image sits.
                    const start = polarToSvg(i * segmentAngle - segmentAngle / 2, 50);
                    const end = polarToSvg(i * segmentAngle + segmentAngle / 2, 50);
                    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                    return (
                      <path
                        key={item._id}
                        d={`M 50 50 L ${start.x} ${start.y} A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`}
                        fill={i % 2 === 0 ? "#FF8A3D" : "#FFFBF5"}
                      />
                    );
                  })}

                  {/* Thick glowing/styled border similar to the required design */}
                  <circle cx="50" cy="50" r="49" fill="none" stroke="#000000" strokeWidth="2" />
                  <circle cx="50" cy="50" r="46.5" fill="none" stroke="#FFF0C2" strokeWidth="5" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#000000" strokeWidth="1.5" />

                  {/* Decorative dots on the ring, one per segment boundary */}
                  {items.map((item, i) => {
                    const dot = polarToSvg(i * segmentAngle - segmentAngle / 2, 46.5);
                    return (
                      <circle key={`dot-${item._id}`} cx={dot.x} cy={dot.y} r="2" fill="#C6AF6B" />
                    );
                  })}
                </svg>

                {/* Prize images on the wheel */}
                <div className="absolute inset-0 pointer-events-none">
                  {items.map((item, i) => {
                    const angle = i * segmentAngle;
                    const rad = ((angle - 90) * Math.PI) / 180;
                    // 0.62 of the radius from center, expressed as a percentage offset.
                    const left = 50 + 0.62 * 50 * Math.cos(rad);
                    const top = 50 + 0.62 * 50 * Math.sin(rad);
                    return (
                      <div
                        key={`img-${item._id}`}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        }}
                      >
                        <div className="relative size-12 md:w-14 md:h-14">
                          <Image
                            src={item.scopeId.image}
                            alt={formatPrize(item.scopeId.scope, item.scopeId.value)}
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
                    alt={wonItem ? formatPrize(wonItem.scope, wonItem.value) : "Prize"}
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
                  Every purchase above ₦30,000 gives you a spin. Reward selected will be added to
                  your item.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={handleOnClaim}
                  disabled={isClaiming}
                  className="w-full bg-[#8cc629] disabled:opacity-70 hover:bg-[#7db424] text-white font-bold py-3.5 rounded-xl text-[18px] transition-all shadow-lg shadow-black/20 tracking-wide mb-4 active:scale-95"
                >
                  {isClaiming ? "Claiming..." : "Claim it!"}
                </button>
                <p className="text-[13px] text-white/80 leading-relaxed italic">
                  Thank you for shopping with us! Your gift will be added to your current order over
                  ₦30,000.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
