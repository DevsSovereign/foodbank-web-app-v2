import Image from "next/image";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCartModal({ isOpen, onClose }: AddToCartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[32px] p-8 max-w-[400px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative size-20 mb-3">
          <Image
            src="/assets/screenshot_20251212025646-removebg-preview-1.png"
            alt="Success icon"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-xl font-extrabold text-black mb-1">Product Added to Cart</h2>
        <p className="text-gray-500 text-[15px] mb-6 leading-snug">
          Product added, you can view it in your cart
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
