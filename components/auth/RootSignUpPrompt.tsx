import Link from "next/link";

export default function RootSignUpPrompt() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">SIGN UP</h2>
      <div className="space-y-6">
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
          Registering for this site allows you to access your order status and history. Just fill in
          the fields below, and we&apos;ll get a new account set up for you in no time. We will only
          ask you for information necessary to make the purchase process faster and easier.
        </p>

        <Link
          href="/signup"
          className="block w-full max-w-sm text-center py-3 bg-[#6cc200] text-white font-medium rounded-md hover:bg-green-600 transition"
        >
          SignUp
        </Link>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 blur-2xl opacity-50 z-[-1] pointer-events-none overflow-hidden h-96 w-48 hidden lg:block">
        <div className="size-96 bg-[#86e216] rounded-full translate-x-1/2"></div>
      </div>
    </div>
  );
}
