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
    return `<iframe src="${shareUrl}" width="100%" height="600px" style="border:none;border-radius:12px;"></iframe>`;
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedEmbed(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border text-foreground p-6 shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold tracking-tight">Share Form</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Distribute your form to your audience.
          </DialogDescription>
        </DialogHeader>

        {!isPublished ? (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200/50 p-3.5 rounded-xl font-medium leading-relaxed my-2">
            ⚠️ This form is a draft. Publish it first to allow responses.
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            {/* Tabs */}
            <div className="flex bg-secondary/60 p-0.5 rounded-xl border border-border/40 gap-0.5">
              {(["link", "qr", "embed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 capitalize ${
                    activeTab === tab
                      ? "bg-card text-foreground shadow-sm border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "qr" ? "QR Code" : tab === "embed" ? "Embed" : "Link"}
                </button>
              ))}
            </div>

            {/* TAB: LINK */}
            {activeTab === "link" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground">
                    Public URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={shareUrl}
                      className="bg-secondary/50 border-border text-xs font-mono select-all text-foreground h-9 rounded-lg"
                    />
                    <Button onClick={handleCopyLink} size="icon" className="h-9 w-9 bg-primary text-primary-foreground shrink-0 hover:bg-primary/90 rounded-lg">
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>

                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="block pt-1">
                  <Button variant="outline" className="w-full border-border hover:bg-secondary text-xs text-foreground h-9 flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-200">
                    Open Live Form <ExternalLink size={13} />
                  </Button>
                </a>
              </div>
            )}

            {/* TAB: QR CODE */}
            {activeTab === "qr" && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-border">
                  <QRCodeSVG value={shareUrl} size={150} level="M" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center max-w-[220px] leading-relaxed">
                  Scan this QR code to open the form on mobile.
                </p>
              </div>
            )}

            {/* TAB: EMBED */}
            {activeTab === "embed" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground">
                    Embed Code
                  </label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={getEmbedCode()}
                      className="w-full bg-secondary/50 border border-border text-[10px] font-mono p-3 rounded-xl text-foreground min-h-[80px] resize-none focus:outline-none"
                    />
                    <Button
                      onClick={handleCopyEmbed}
                      size="icon"
                      className="absolute right-2.5 bottom-2.5 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
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
