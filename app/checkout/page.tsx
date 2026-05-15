"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Home, User, MapPin, Phone, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditCustomerModal from "../../components/checkout/EditCustomerModal";
import AddPhoneNumberModal from "../../components/checkout/AddPhoneNumberModal";
import DatePickerModal from "../../components/checkout/DatePickerModal";
import CheckoutTotal from "@/components/ui/CheckoutTotal";
import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/functions/formatCurrency";

const FALLBACK_ADDRESS = "";

export default function CheckoutPage() {
  const { user } = useUserStore();
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<"wallet" | "online">("wallet");
  const [purchaseOutright, setPurchaseOutright] = useState<boolean>(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState<boolean>(false);
  const [isAddPhoneModalOpen, setIsAddPhoneModalOpen] = useState<boolean>(false);
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>(
    "Detecting your current location…",
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date>(() => new Date());

  useEffect(() => {
    async function detectAddress(): Promise<string> {
      if (!navigator.geolocation) return FALLBACK_ADDRESS;

      return new Promise<string>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
                { headers: { "Accept-Language": "en" } },
              );
              const data = await res.json();
              const a = data.address ?? {};
              const parts = [
                a.house_number,
                a.road,
                a.suburb ?? a.neighbourhood ?? a.quarter,
                a.city ?? a.town ?? a.village,
                a.state,
              ].filter(Boolean);
              resolve(parts.length ? parts.join(", ") : FALLBACK_ADDRESS);
            } catch {
              resolve(FALLBACK_ADDRESS);
            }
          },
          () => resolve(FALLBACK_ADDRESS),
          { timeout: 8000 },
        );
      });
    }

    detectAddress().then(setCustomerAddress);
  }, []);

  return (
    <Suspense fallback={<Loader2 className="size-5 animate-spin" />}>
      <div className="min-h-screen flex flex-col bg-[#fdfdfc]">
        <TopRibbon />
        <Header />

        <nav className="bg-white border-b border-gray-100 py-3 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="text-sm font-medium flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-800">Checkout</span>
            </div>

            <button
              className="md:hidden text-gray-600 p-1"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileNavOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 12v0M4 6v0M4 18v0M8 12h12M8 6h12M8 18h12" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/categories"
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition"
              >
                <span className="text-gray-800">All Category</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>

              <Link
                href="/dashboard/track-delivery"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Track Order
              </Link>

              <Link
                href="/dashboard/support"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Customer Support
              </Link>

              <Link
                href="/dashboard/help-center"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Help Center
              </Link>
            </div>
          </div>

          {mobileNavOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-sm px-4 py-3 pb-4 space-y-4">
              <Link
                href="/categories"
                className="flex items-center justify-between text-sm text-gray-600 hover:text-[#6cc200] transition"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  All Category
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link
                href="/dashboard/track-delivery"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Track Order
              </Link>
              <Link
                href="/dashboard/support"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Customer Support
              </Link>
              <Link
                href="/dashboard/help-center"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Help Center
              </Link>
            </div>
          )}
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
          <div className="bg-white border text-center md:text-left border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <h2 className="text-[20px] font-bold text-gray-800">Customer Details</h2>
              <button
                onClick={() => setIsEditCustomerModalOpen(true)}
                className="text-[#8cc629] text-[13px] font-medium flex items-center gap-1 hover:underline"
              >
                Edit Customer Address <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {user && (
                <div className="flex items-center gap-3">
                  <User className="text-[#8cc629] w-4.5 h-4.5" />
                  <span className="text-gray-700 text-sm">{`${user.firstName} ${user.lastName}`}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="text-[#8cc629] w-4.5 h-4.5 mt-0.5" />
                <span className="text-gray-700 text-sm">{customerAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[#8cc629] w-4.5 h-4.5" />
                {customerPhone ? (
                  <span className="text-gray-700 text-sm font-medium">{customerPhone}</span>
                ) : (
                  <button
                    onClick={() => setIsAddPhoneModalOpen(true)}
                    className="text-[#8cc629] font-medium text-sm hover:underline"
                  >
                    Add Phone number
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#fff5f5] text-[#ff8080] py-3 px-5 rounded-md text-[13px] font-medium inline-block w-full">
              Ensure numbers are reachable at delivery to avoid cancellation or extra fees
            </div>
          </div>

          <div className="bg-white border border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <h2 className="text-[20px] font-bold text-gray-800">Delivery Details</h2>
              <button
                onClick={() => setIsDatePickerOpen(true)}
                className="text-[#8cc629] text-[13px] font-medium flex items-center gap-1 hover:underline"
              >
                Set a date from today upward <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {selectedDeliveryDate ? (
              <div className="border border-[#8cc629] bg-[#f4faee] rounded-md py-6 flex flex-col items-center justify-center text-center">
                <p className="text-gray-800 font-bold mb-1.5">
                  {selectedDeliveryDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-500 text-xs">Door Delivery</p>
              </div>
            ) : (
              <div className="border border-dashed border-[#e6e6e6] bg-[#fafafa] rounded-md py-8 flex flex-col items-center justify-center text-center">
                <p className="text-gray-700 text-sm font-medium mb-1.5">
                  Select a day upward from today
                </p>
                <p className="text-gray-400 text-xs shadow-sm">Door Delivery</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <h2 className="text-[20px] font-bold text-gray-800">Items Charges</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-500 text-[14px]">
                <span>Subtotal</span>
                <CheckoutTotal type="subtotal" />
                {/* <span className="font-bold text-gray-800">
                ₦{subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span> */}
              </div>
              <div className="flex justify-between items-center text-gray-500 text-[14px]">
                <span>Delivery Charge</span>
                <CheckoutTotal type="deliveryCharge" />
                {/* <span className="font-bold text-gray-800">
                ₦{deliveryCharge.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span> */}
              </div>
              <div className="flex justify-between items-center text-gray-500 text-[14px] mb-4">
                <span>Service Charge</span>
                <CheckoutTotal type="serviceCharge" />
                {/* <span className="font-bold text-gray-800">
                ₦{serviceCharge.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span> */}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                <span className="font-bold text-gray-800 text-[15px]">Total</span>
                <CheckoutTotal type="total" />
                {/* <span className="font-black text-gray-800 text-lg">
                  ₦{total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span> */}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg shadow-sm pb-6">
            <div className="px-6 md:px-8 py-5 border-b border-gray-100 mb-6">
              <h2 className="text-[18px] font-bold text-gray-800">Payment Options</h2>
            </div>

            <div className="px-6 md:px-8">
              <div className="flex max-w-85 border border-gray-100 rounded-lg h-32.5">
                <div
                  onClick={() => setPaymentOption("wallet")}
                  className={`flex-1 flex flex-col items-center justify-center border-r border-gray-100 cursor-pointer transition-colors ${paymentOption === "wallet" ? "bg-white" : "bg-gray-50"}`}
                >
                  <span
                    className={`text-2xl font-bold mb-1 ${paymentOption === "wallet" ? "text-[#8cc629]" : "text-gray-400"}`}
                  >
                    {formatCurrency(user?.virtualAccount?.walletbalance ?? 0)}
                  </span>

                  <span className="text-[12px] text-gray-800 mb-4 font-medium">Wallet Balance</span>
                  <div
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${paymentOption === "wallet" ? "border-4 border-[#8cc629]" : "border border-gray-300"}`}
                  >
                    {paymentOption === "wallet" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8cc629]"></div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentOption("online")}
                  className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors ${paymentOption === "online" ? "bg-white" : "bg-gray-50"}`}
                >
                  <CreditCard
                    className={`w-6 h-6 mb-1 ${paymentOption === "online" ? "text-gray-700" : "text-gray-400"}`}
                  />
                  <span className="text-[11px] font-medium text-gray-800 mb-2">Transfer</span>
                  <span className="text-[12px] text-gray-800 mb-4 font-medium">Pay Online</span>
                  <div
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${paymentOption === "online" ? "border-4 border-[#8cc629]" : "border border-gray-300"}`}
                  >
                    {paymentOption === "online" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8cc629]"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f9e1] rounded-lg p-5 px-6 flex justify-between items-center transition-opacity">
            <span className="text-[#1e293b] text-[15px] font-bold">Purchase Outright</span>
            <button
              onClick={() => setPurchaseOutright((prev) => !prev)}
              className={`w-11 h-6 rounded-full relative flex items-center p-1 transition-colors duration-300 ease-in-out ${purchaseOutright ? "bg-[#8cc629]" : "bg-gray-200"}`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${purchaseOutright ? "translate-x-5" : "translate-x-0"}`}
              ></span>
            </button>
          </div>

          <Link
            href="/checkout/payment"
            className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4.5 rounded-md font-bold text-[13px] tracking-wider transition-colors mt-6 uppercase flex justify-center items-center"
          >
            Confirm Checkout
          </Link>
        </main>

        <Footer />

        <EditCustomerModal
          isOpen={isEditCustomerModalOpen}
          onClose={() => setIsEditCustomerModalOpen(false)}
          onSave={(details) => {
            const { houseNumber, landmark, stateLocation } = details;
            const addressParts = [houseNumber, landmark, stateLocation].filter(Boolean);
            if (addressParts.length > 0) {
              setCustomerAddress(addressParts.join(", "));
            }
          }}
        />

        <AddPhoneNumberModal
          isOpen={isAddPhoneModalOpen}
          onClose={() => setIsAddPhoneModalOpen(false)}
          onSave={(phone) => setCustomerPhone(phone)}
        />

        <DatePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onSelectDate={setSelectedDeliveryDate}
          selectedDate={selectedDeliveryDate}
        />
      </div>
    </Suspense>
  );
}
