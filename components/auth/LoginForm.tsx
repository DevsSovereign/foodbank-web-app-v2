import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">LOGIN</h2>
      <div className="space-y-6">
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
          Welcome back! Log in with your credentials to access your order status, purchase history,
          and manage your account preferences. Let&apos;s get you securely signed in to continue.
        </p>

        <Link
          href="/login"
          className="block w-full max-w-sm text-center py-3 bg-[#6cc200] text-white font-medium rounded-md hover:bg-green-600 transition"
        >
          Login
        </Link>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 blur-2xl opacity-50 z-[-1] pointer-events-none overflow-hidden h-96 w-48">
        <div className="size-96 bg-[#86e216] rounded-full translate-x-1/2"></div>
      </div>
    </div>
  );
}
