"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-[#8B5CF6]" size={20} />
        <span className="text-[#A1A1AA] text-xs font-mono animate-pulse">
          {message}
        </span>
      </div>
    </div>
  );
}
