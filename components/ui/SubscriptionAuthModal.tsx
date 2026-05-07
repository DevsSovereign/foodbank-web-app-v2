import Image from "next/image";

interface SubscriptionAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionAuthModal({ isOpen, onClose }: SubscriptionAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[32px] p-8 max-w-[400px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative size-24 mb-4">
          <Image
            src="/assets/screenshot-2.png"
            alt="Oops emoji"
            fill
            className="object-contain animate-[bounce_2s_infinite]"
          />
        </div>
        <h2 className="text-xl font-extrabold text-black mb-3">Oops!</h2>
        <p className="text-gray-600 text-[15px] mb-8 leading-relaxed max-w-[280px]">
          Registration is required before subscribing to Buy Now, Pay Later.
        </p>
        <button
          className="bg-[#8cc629] hover:bg-[#7db424] text-white font-bold w-[160px] py-3.5 rounded-xl transition-colors shadow-sm active:scale-95"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
