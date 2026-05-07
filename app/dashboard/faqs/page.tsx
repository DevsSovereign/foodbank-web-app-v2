"use client";

import React, { useState } from "react";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useGetFAQs } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import LoaderSection from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";

const FAQS = [
  {
    question: "How does Foodbank Loan work?",
    answer:
      "Foodbank Loan allows you to purchase food items now and pay later. Simply apply for a loan, get approved, and use your credit limit to shop for groceries.",
  },
  {
    question: "What is the repayment period for the foodbank loan?",
    answer:
      "The repayment period typically ranges from 14 to 30 days, depending on your specific loan agreement and credit history.",
  },
  {
    question: "How can I get started with Foodbank Loan?",
    answer:
      "To get started, navigate to the 'Loans' tab on your dashboard, complete the verification process, and click 'Apply Now'.",
  },
  {
    question: "What is food bank Loan?",
    answer:
      "Food bank Loan is a credit facility designed to ensure you never run out of food. It provides short-term financing specifically for grocery purchases on our platform.",
  },
  {
    question: "Is a Foodbank Loan Secure?",
    answer:
      "Yes, we use bank-grade security encryption to protect your data and transactions. We are fully compliant with relevant financial regulations.",
  },
  {
    question: "How do I get the food delivered?",
    answer:
      "Once you place an order using your wallet or loan balance, our logistics partners will deliver the items directly to your registered address.",
  },
  {
    question: "How quickly can I get Foodbank Loan?",
    answer:
      "Approval is often instant or within minutes after you submit your BVN and other required details for verification.",
  },
];

export default function FaqsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const {
    data: faqData,
    isLoading: faqLoading,
    isRefetching: faqRefetching,
    error: faqError,
    refetch: refetchFAQ,
  } = useGetFAQs();
  const router = useRouter();

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (faqError) {
    return (
      <ErrorSection message="Failed to load FAQs. Please try again later." onRetry={refetchFAQ} />
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Foodbank Support</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Find answers to common questions about orders, payments, and how Food Bank works.
          We&apos;re here to help whenever you need support.
        </p>
      </div>

      <div className="relative mb-10">
        <input
          type="text"
          placeholder="Search help..."
          className="w-full px-4 py-3 pr-12 rounded-lg border border-[#8cc629] focus:outline-none focus:ring-2 focus:ring-[#8cc629]/50 transition-all placeholder:text-gray-400 text-sm"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8cc629] size-5" />
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions.</h2>
        <div className="space-y-3">
          {faqLoading || faqRefetching ? (
            <LoaderSection />
          ) : !faqData || faqData.faqs.length < 1 ? (
            <EmptyState message="No FAQs found." />
          ) : (
            FAQS.map((faq, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-[#5ba86e] hover:bg-[#4ca16a] text-white text-left transition-colors"
                >
                  <span className="text-sm font-medium">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronDown className="size-5 shrink-0" />
                  ) : (
                    <ChevronRight className="size-5 shrink-0" />
                  )}
                </button>

                {openFaqIndex === index && (
                  <div className="bg-white border border-gray-100 border-t-0 p-6 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-2 border-dashed border-red-100 rounded-xl p-8 bg-white/50">
        <h3 className="text-base font-bold text-gray-900 mb-2">Still Struck?</h3>
        <p className="text-gray-500 text-sm mb-6">
          Can&apos;t find the answer you&apos;re looking for? Send us a message and our support team
          will be happy to help.
        </p>
        <button
          onClick={() => router.push("/dashboard/support")}
          className="bg-[#8cc629] hover:bg-[#7db424] text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm w-full sm:w-auto"
        >
          Send a Message
        </button>
      </div>
    </div>
  );
}
