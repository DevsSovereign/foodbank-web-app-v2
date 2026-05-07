"use client";

import Image from "next/image";

interface TermsContentProps {
  hideButton?: boolean;
}

export default function TermsContent({ hideButton = false }: TermsContentProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 tracking-wide uppercase">
        TERMS & CONDITIONS
      </h2>

      <Image
        src="/assets/app-logo.svg"
        alt="FoodBank Logo"
        width={180}
        height={48}
        className="mb-10 object-contain"
      />

      <div className="space-y-6 text-gray-600 text-sm leading-relaxed max-w-3xl text-left">
        <p>
          Welcome to Food Bank, a service provided by Sovereign Technology and Innovation Limited.
          By using the Food Bank app, you agree to comply with and be bound by the following terms
          and conditions.
        </p>

        <div>
          <h3 className="text-gray-800 font-medium mb-1">1. Acceptance of Terms</h3>
          <p>
            By accessing and using the Food Bank app, you accept and agree to be bound by these
            terms and conditions. If you do not agree to these terms, please do not use the app.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-gray-800">2. Eligibility</h3>
          <p>
            To use Food Bank, you must be at least 18 years old. In exceptional cases, users from 15
            years old may apply, but you must have the legal capacity to enter into a binding
            agreement.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-gray-800">3. Services</h3>
          <p>
            Food Bank provides food loans, nutritional plans, and access to dietary consultations,
            among other services. These services may be changed or discontinued at any time without
            notice.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-gray-800">4. User Accounts</h3>
          <p>
            You are required to create an account to access certain features of the app. You are
            responsible for maintaining the confidentiality of your account information and for all
            activities that occur under your account.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-gray-800">5. Food Loans</h3>
          <p>
            By applying for a food loan, you agree to the repayment terms as outlined in the app.
            Repayments will be automatically deducted from your future paychecks.
          </p>
        </div>
      </div>

      {!hideButton && (
        <button
          type="button"
          onClick={() => (window.location.href = "/signup")}
          className="w-full max-w-sm bg-[#6cc200] text-white font-medium py-3 px-4 rounded-md hover:bg-green-600 transition duration-150 ease-in-out mt-12 block mx-auto"
        >
          I Agree
        </button>
      )}
    </div>
  );
}
