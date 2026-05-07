import Link from "next/link";

export default function MyAccountPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-gray-500 text-base mb-1">Good Morning, FoodBanker</p>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#5ba800] to-[#8cc629] p-10 md:p-14 text-white shadow-xl shadow-green-100/50 w-full">
        <div className="relative z-10 w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Unlock Your FoodBank Experience
          </h2>
          <p className="text-[16px] md:text-[18px] font-medium mb-10 leading-[1.4] opacity-90 lg:whitespace-nowrap">
            Create an account today to access exclusive features, track your orders, and manage your
            deliveries seamlessly.
          </p>

          <div className="flex flex-row gap-3 sm:gap-5">
            <Link
              href="/signup"
              className="bg-[#8cc629] border border-white/20 hover:bg-[#7db424] text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-center transition-all shadow-lg active:scale-95 flex-1 sm:flex-none text-sm sm:text-base"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-[#8cc629] px-4 sm:px-12 py-3 sm:py-4 rounded-lg font-bold text-center transition-all shadow-lg active:scale-95 flex-1 sm:flex-none text-sm sm:text-base"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 size-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 size-96 bg-black/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
    </div>
  );
}
