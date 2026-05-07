"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function SupportPage() {
  const [issueTitle, setIssueTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSend = () => {
    if (issueTitle.trim() && message.trim()) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssueTitle("");
    setMessage("");
  };

  return (
    <>
      <div className="w-full max-w-4xl">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">Contact Support</h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title
            </label>
            <input
              type="text"
              id="issueTitle"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all resize-none overflow-y-auto"
            />
          </div>

          <div>
            <div className="w-full border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="size-6 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Attachment (Optional)</p>
              <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={handleSend}
              className="flex-1 bg-[#8cc629] hover:bg-[#7db424] text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-colors"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => {
                setIssueTitle("");
                setMessage("");
              }}
              className="flex-1 bg-[#e5e5e5] hover:bg-[#d4d4d4] text-gray-600 px-8 py-3.5 rounded-lg font-bold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-100 p-8 text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="mb-4 relative size-20">
              <Image
                src="/assets/screenshot_20251212042158-removebg-preview-1.png"
                alt="Success"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 mb-2">Issue Submitted</h2>
            <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
              Your message has been sent successfully
            </p>
            <button
              onClick={handleCloseModal}
              className="bg-[#8cc629] hover:bg-[#7db424] text-white px-10 py-3 rounded-lg font-bold text-sm transition-colors w-auto min-w-30"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
