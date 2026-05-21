"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, QrCode, Code } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formSlug: string;
  isPublished: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  formSlug,
  isPublished,
}: ShareDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr" | "embed">("link");

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/share/${formSlug}`;
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast.success("Share link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getEmbedCode = () => {
    return `<iframe src="${shareUrl}" width="100%" height="600px" style="border:none;border-radius:12px;background:#09090B;"></iframe>`;
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedEmbed(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[#111111] border-[#27272A] text-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight">Share Form</DialogTitle>
          <DialogDescription className="text-xs text-[#A1A1AA]">
            Publish your form to share it with your audience.
          </DialogDescription>
        </DialogHeader>

        {!isPublished ? (
          <div className="text-xs text-amber-400 bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-lg font-medium leading-relaxed my-2">
            ⚠️ This form is currently a draft. Please publish the form first using the &quot;Publish&quot; button in the header to allow people to fill it out.
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            {/* Inner tabs */}
            <div className="flex border-b border-[#27272A] gap-4 text-xs font-mono pb-2">
              <button
                onClick={() => setActiveTab("link")}
                className={`pb-1 font-semibold transition-colors relative ${
                  activeTab === "link" ? "text-white" : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                Link
              </button>
              <button
                onClick={() => setActiveTab("qr")}
                className={`pb-1 font-semibold transition-colors relative ${
                  activeTab === "qr" ? "text-white" : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setActiveTab("embed")}
                className={`pb-1 font-semibold transition-colors relative ${
                  activeTab === "embed" ? "text-white" : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                Embed
              </button>
            </div>

            {/* TAB: LINK */}
            {activeTab === "link" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">
                    Public URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={shareUrl}
                      className="bg-[#18181B] border-[#27272A] text-xs font-mono select-all text-zinc-300 h-9"
                    />
                    <Button onClick={handleCopyLink} size="icon" className="h-9 w-9 bg-white text-black shrink-0 hover:bg-white/90">
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>

                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="block pt-2">
                  <Button variant="outline" className="w-full border-[#27272A] hover:bg-[#18181B] text-xs text-white h-9 flex items-center justify-center gap-1.5 font-medium">
                    Open Live Form <ExternalLink size={13} />
                  </Button>
                </a>
              </div>
            )}

            {/* TAB: QR CODE */}
            {activeTab === "qr" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="p-3 bg-white rounded-xl shadow-lg border border-[#27272A]">
                  <QRCodeSVG value={shareUrl} size={150} level="M" />
                </div>
                <p className="text-[10px] text-[#A1A1AA] font-mono text-center max-w-[250px]">
                  Download or scan this QR code to quickly open the conversational form on mobile devices.
                </p>
              </div>
            )}

            {/* TAB: EMBED */}
            {activeTab === "embed" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">
                    IFrame Embed Snippet
                  </label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={getEmbedCode()}
                      className="w-full bg-[#18181B] border border-[#27272A] text-[10px] font-mono p-3 rounded-lg text-zinc-300 min-h-[80px] resize-none focus:outline-none"
                    />
                    <Button
                      onClick={handleCopyEmbed}
                      size="icon"
                      className="absolute right-2.5 bottom-2.5 h-7 w-7 bg-white text-black hover:bg-white/90"
                      title="Copy embed snippet"
                    >
                      {copiedEmbed ? <Check size={12} /> : <Copy size={12} />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
