"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingBlurOverlay({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[3px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl px-6 py-4 flex items-center gap-3">
          <Loader2 className="size-5 animate-spin text-[#6cc200]" />
          <span className="text-sm font-medium text-gray-700">Loading…</span>
        </div>
      </div>
    </div>
  );
}
