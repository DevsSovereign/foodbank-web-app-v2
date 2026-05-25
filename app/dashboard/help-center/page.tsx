"use client";

import React, { useState } from "react";
import { Search, SendHorizontal } from "lucide-react";

export default function HelpCenterPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl">
      {!isChatOpen ? (
        <>
          <div className="mb-10">
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">Hi there</h1>
            <p className="text-[#6B7280] text-[15px]">
              Need Help? Search our help center for help or start a conversation
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-[15px] font-semibold text-gray-800 mb-6 uppercase tracking-wide">
                Help Centre
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for browse a"
                  className="w-full bg-[#FAFAFA] border border-gray-100 rounded-lg px-4 py-3 text-[14px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629] transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              </div>
            </div>

            <button
              className="w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors text-left"
              onClick={() => setIsChatOpen(true)}
              type="button"
            >
              <div>
                <h2 className="text-[15px] font-semibold text-gray-800 mb-1">New Conversation</h2>
                <p className="text-[14px] text-gray-500">We typically reply in a few minutes</p>
              </div>
              <div className="p-2 text-gray-400">
                <SendHorizontal size={24} />
              </div>
            </button>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">
              Food Bank Customer Care
            </h1>
            <p className="text-[#6B7280] text-[15px]">Start a Conversation</p>
          </div>

          <div className="space-y-8">
            <div className="max-w-[80%]">
              <p className="text-[14px] text-gray-500 mb-2 font-medium">
                Food Bank Customer Care
              </p>
              <div className="flex items-end gap-2">
                <div className="bg-[#8cc629] text-white p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <p className="text-[15px] leading-relaxed">
                    Good Day, welcome to food bank customer service channel. how can we be of help
                    to you today
                  </p>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0 mb-1">09:17</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <p className="text-[14px] text-gray-500 mb-1 font-medium w-full text-right">
                New Messages
              </p>
              <div className="bg-white border-2 border-[#8cc629]/30 hover:border-[#8cc629] text-gray-800 px-6 py-3 rounded-2xl rounded-br-none shadow-sm cursor-pointer transition-all">
                <p className="text-[15px]">i have a question</p>
              </div>
              <div className="bg-white border-2 border-[#8cc629]/30 hover:border-[#8cc629] text-gray-800 px-6 py-3 rounded-2xl rounded-br-none shadow-sm cursor-pointer transition-all max-w-[80%]">
                <p className="text-[15px]">Tell me more about the buy now, pay later service</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="mt-12 text-[#8cc629] font-semibold flex items-center gap-2 hover:underline"
          >
            <span>Back to Help Center</span>
          </button>
        </div>
      )}
    </div>
  );
}
