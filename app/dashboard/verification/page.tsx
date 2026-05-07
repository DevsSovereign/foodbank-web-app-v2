export default function VerificationPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-gray-500 text-base mb-1">Good Morning,</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">DONALD</h1>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4ca16a] to-[#73b537] p-10 md:p-14 text-white shadow-xl shadow-green-100/50 w-full">
        <div className="relative z-10 w-full flex flex-col items-start gap-8">
          <p className="text-[18px] md:text-[20px] font-medium leading-[1.4] opacity-95">
            Your verification has been submitted and is currently under review. This may take a few
            minutes.
          </p>

          <div className="flex-shrink-0">
            <button
              disabled
              className="bg-white text-[#8cc629] px-8 py-4 rounded-lg font-bold text-center shadow-sm cursor-not-allowed inline-block whitespace-nowrap"
            >
              Verification under Review
            </button>
          </div>
        </div>

        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 size-80 bg-white/20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 size-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
}
