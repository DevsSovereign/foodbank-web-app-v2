"use client";

import Image from "next/image";
import { Check, Copy, Lock } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import EmptyState from "@/components/ui/EmptyState";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useGetAccountOfficer } from "@/lib/queries";
import { handleError } from "@/lib/handle-error";
import LoaderSection from "@/components/ui/Loader";

const NO_STAFF_ASSIGNED = "no staff assignment found for this customer";

export default function PersonalDetailsPage() {
  const { user } = useUserStore();
  const { copy, copied } = useCopyToClipboard();
  const {
    data: accountOfficer,
    isLoading: accountOfficerLoading,
    error: acccountOfficerError,
  } = useGetAccountOfficer();

  const errorMessage = handleError(acccountOfficerError);

  if (!user) {
    return <EmptyState />;
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* ACCOUNT SETTINGS */}
      <section
        id="personal-details"
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-24"
      >
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
          ACCOUNT SETTINGS
        </h2>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Picture</h3>
          <div className="flex flex-row items-center gap-4 sm:gap-8 md:gap-12">
            <div className="size-16 sm:w-20 sm:h-20 relative shrink-0">
              <Image src="/assets/frame-4580.png" alt="Profile" fill className="object-contain" />
            </div>
            {/* <div className="flex flex-row items-center gap-3 sm:gap-8 md:gap-12 flex-wrap">
              <button className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
                Remove Avatar
              </button>
              <button className="text-xs sm:text-sm font-medium text-[#8cc629] border border-[#8cc629] rounded-lg px-4 sm:px-6 py-1.5 sm:py-2 hover:bg-[#f0f7e6] transition-colors whitespace-nowrap">
                Change Avatar
              </button>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName || user?.lastName
                ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-semibold text-gray-900">{user?.email ? user?.email : "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
            <p className="text-sm font-semibold text-gray-900">
              {user?.phoneNumber ? user?.phoneNumber : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Account Region</p>
            <p className="text-sm font-semibold text-gray-900">
              {user?.address ? user?.address : "-"}
            </p>
          </div>
        </div>

        <p className="text-xs text-orange-500 font-medium">
          NOTE THAT: Your details are initially set based on region, time and place of registration
        </p>
      </section>

      {/* BVN INFORMATION */}
      {user?.accountType !== "outright" && (
        <section
          id="bvn-information"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-24"
        >
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
            BVN INFORMATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-xs text-gray-500 mb-1">BVN Number</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.bvn ? user.bvn.slice(0, 3) + "*******" : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.deliveryAddress ? user?.deliveryAddress : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.dateOfBirth ? user?.dateOfBirth : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Gender</p>
              <p className="text-sm capitalize font-semibold text-gray-900">
                {user?.gender ? user?.gender : "-"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* VIRTUAL ACCOUNT */}
      {user?.accountType !== "outright" && (
        <section
          id="virtual-account"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-24"
        >
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
            VIRTUAL ACCOUNT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.virtualAccount?.bankName ? user?.virtualAccount?.bankName : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Holder Name</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.virtualAccount?.accountName ? user?.virtualAccount?.accountName : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.virtualAccount?.virtualAccountNumber
                    ? user?.virtualAccount?.virtualAccountNumber
                    : "-"}
                </p>
                <button
                  type="button"
                  onClick={() => copy(user?.virtualAccount?.virtualAccountNumber)}
                  className="text-[#8cc629] cursor-pointer hover:text-[#7db424] flex items-center gap-1 text-xs font-medium"
                >
                  {copied ? "Copied" : "Copy"}
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* JOB INFORMATION */}
      {user?.accountType !== "outright" && (
        <section
          id="job-information"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-24"
        >
          {/* <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
            JOB INFORMATION
          </h2>

          <div className="mb-8">
            <p className="text-xs text-gray-500 mb-1">Employment Status</p>
            <p className="text-sm font-semibold text-gray-900">Student</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-semibold text-gray-900">Student</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Institution</p>
              <p className="text-sm font-semibold text-gray-900">LASU</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Faculty</p>
              <p className="text-sm font-semibold text-gray-900">Arts and Culture</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Level</p>
              <p className="text-sm font-semibold text-gray-900">300</p>
            </div>
          </div> */}

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-900">Bank Account Information</h3>

            {user?.linkedBanks?.map((bank, _index, array) => {
              const isLast = array.indexOf(bank) === array.length - 1;

              return (
                <div
                  key={bank._id}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 ${!isLast && "pb-2 border-b border-gray-300"}`}
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Name</p>
                    <p className="text-sm font-semibold text-gray-900">{bank.account_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="text-sm font-semibold text-gray-900">{bank.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                    <p className="text-sm font-semibold text-gray-900">{bank.account_number}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ACCOUNT OFFICER */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
          ACCOUNT OFFICER
        </h2>

        {accountOfficerLoading ? (
          <LoaderSection />
        ) : errorMessage.toLowerCase() === NO_STAFF_ASSIGNED || !accountOfficer ? (
          <p className="text-sm font-semibold text-gray-900">{errorMessage}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Officer&apos;s Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {accountOfficer.firstName}&nbsp;{accountOfficer.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Personal Email</p>
                <p className="text-sm font-semibold text-gray-900">{accountOfficer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">{accountOfficer.phoneNumber}</p>
              </div>
            </div>

            <p className="text-xs text-orange-500 font-medium">
              For complaints or assistance, please contact your Account Officer or Customer Support.
            </p>
          </div>
        )}
      </section>

      {/* SECURITY SETTINGS */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-6">
          SECURITY SETTINGS
        </h2>

        <Link
          href="/dashboard/account/set-pin"
          className="inline-flex items-center gap-3 text-gray-900 hover:text-[#8cc629] transition-colors"
        >
          <Lock className="size-5" />
          <span className="text-sm font-semibold">Set up PIN for Login</span>
        </Link>
      </section>
    </div>
  );
}
