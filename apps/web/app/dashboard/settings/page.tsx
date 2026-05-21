"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Key,
  Webhook,
  Users,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Header } from "~/components/app/header";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthGuard();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"workspace" | "billing" | "api" | "team">("workspace");

  // State values for API & Webhooks
  const [apiKeys, setApiKeys] = useState<{ id: string; key: string; name: string; created: string }[]>([
    { id: "1", name: "Production Frontend", key: "patra_live_7f8c92b...1d", created: "2026-05-18" },
  ]);
  const [webhooks, setWebhooks] = useState<{ id: string; url: string; event: string; active: boolean }[]>([
    { id: "1", url: "https://api.my-saas.com/v1/patra-webhook", event: "form.submitted", active: true },
  ]);
  
  const [newKeyName, setNewKeyName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState<{ email: string; role: string; status: string }[]>([
    { email: "collaborator@patra.io", role: "editor", status: "pending" },
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `patra_live_${randomHex.slice(0, 10)}...${randomHex.slice(-4)}`,
      created: new Date().toISOString().split("T")[0]!,
    };
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName("");
    toast.success("API key generated");
  };

  const handleAddWebhook = () => {
    if (!webhookUrl.trim()) return;
    setWebhooks((prev) => [
      ...prev,
      { id: Date.now().toString(), url: webhookUrl, event: "form.submitted", active: true },
    ]);
    setWebhookUrl("");
    toast.success("Webhook register updated");
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInvites((prev) => [...prev, { email: inviteEmail, role: "editor", status: "pending" }]);
    setInviteEmail("");
    toast.success("Invitation dispatched successfully");
  };

  if (!user) return null;

  return (
    <>
      <Header title="Settings" breadcrumbs={[{ label: "Patra" }, { label: "Settings" }]} />

      <div className="p-6 max-w-4xl w-full mx-auto space-y-6 flex-1">
        {/* Tab Selection Row */}
        <div className="flex border-b border-[#27272A] gap-6 text-xs font-mono uppercase">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === "workspace" ? "text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Workspace Info
            {activeTab === "workspace" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5CF6]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === "billing" ? "text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Billing & Usage
            {activeTab === "billing" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5CF6]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === "api" ? "text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            API Keys & Webhooks
            {activeTab === "api" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5CF6]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === "team" ? "text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Team Members
            {activeTab === "team" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5CF6]" />
            )}
          </button>
        </div>

        {/* TAB 1: WORKSPACE INFO */}
        {activeTab === "workspace" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white tracking-tight">General Details</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">Modify metadata relating to your creator organization.</p>
            </div>

            <div className="space-y-4 border border-[#27272A] rounded-xl p-6 bg-[#111111]">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono">Workspace Name</label>
                <Input defaultValue="Patra Workspace" className="bg-[#18181B] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono">Support Contact Email</label>
                <Input defaultValue={user.email} className="bg-[#18181B] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white" />
              </div>

              <Button className="bg-[#FAFAFA] hover:bg-[#FAFAFA]/90 text-[#09090B] font-bold text-xs font-semibold" onClick={() => toast.success("Workspace saved")}>
                Save Settings
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: BILLING & USAGE */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white tracking-tight">Subscription Profile</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">Review your usage limits, invoices, and active tier features.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Plan */}
              <div className="border border-[#27272A] rounded-xl p-6 bg-[#111111] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono">Current Plan</span>
                    <h4 className="text-lg font-bold text-white capitalize">{user.plan} Account</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-mono">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">Monthly Responses Usage</span>
                    <span className="text-white font-mono">152 / 10,000</span>
                  </div>
                  <div className="h-2 w-full bg-[#18181B] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6]" style={{ width: "1.5%" }} />
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="border-[#27272A] hover:bg-[#18181B] text-xs text-[#FAFAFA]" onClick={() => toast.info("Stripe portal simulated.")}>
                    Update payment method <ExternalLink size={12} className="ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Plan Highlights */}
              <div className="border border-[#27272A] rounded-xl p-6 bg-[#111111] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Features Included</h4>
                <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Unlimited forms and submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>AI generation modal assistants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Custom color palettes & system themes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API KEYS & WEBHOOKS */}
        {activeTab === "api" && (
          <div className="space-y-8">
            {/* API Keys */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-tight">Workspace API Keys</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">Use these keys to access form data via our HTTP services.</p>
              </div>

              <div className="border border-[#27272A] rounded-xl p-6 bg-[#111111] space-y-4">
                <div className="flex gap-3 max-w-md">
                  <Input
                    placeholder="API Key label (e.g. Retool)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-[#18181B] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white"
                  />
                  <Button onClick={handleGenerateKey} className="bg-white text-black font-semibold text-xs px-4">
                    Generate Key
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs">
                      <div>
                        <div className="font-semibold text-white">{key.name}</div>
                        <div className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">{key.key}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className="p-1.5 hover:bg-[#27272A] rounded text-[#A1A1AA] hover:text-white"
                        >
                          {copiedKeyId === key.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                        <button
                          onClick={() => setApiKeys((prev) => prev.filter((k) => k.id !== key.id))}
                          className="p-1.5 hover:bg-red-950/20 rounded text-[#A1A1AA] hover:text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Webhooks */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-tight">Event Webhooks</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">Configure endpoints to receive payload notifications on submission triggers.</p>
              </div>

              <div className="border border-[#27272A] rounded-xl p-6 bg-[#111111] space-y-4">
                <div className="flex gap-3 max-w-md">
                  <Input
                    placeholder="Webhook endpoint URL (HTTPS)"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="bg-[#18181B] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white"
                  />
                  <Button onClick={handleAddWebhook} className="bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] px-4">
                    Add URL
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {webhooks.map((hook) => (
                    <div key={hook.id} className="flex items-center justify-between p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs">
                      <div className="overflow-hidden pr-4">
                        <div className="font-mono text-white truncate">{hook.url}</div>
                        <div className="text-[10px] text-[#8B5CF6] font-mono mt-0.5">{hook.event}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono">
                          ACTIVE
                        </span>
                        <button
                          onClick={() => setWebhooks((prev) => prev.filter((h) => h.id !== hook.id))}
                          className="p-1.5 hover:bg-red-950/20 rounded text-[#A1A1AA] hover:text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEAM MEMBERS */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white tracking-tight">Collaborators</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">Manage users authorized to access and modify workspace forms.</p>
            </div>

            <div className="border border-[#27272A] rounded-xl p-6 bg-[#111111] space-y-6">
              {/* Invite form */}
              <form onSubmit={handleSendInvite} className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="partner@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-[#18181B] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white"
                  required
                />
                <Button type="submit" className="bg-[#FAFAFA] text-[#09090B] font-bold text-xs px-4">
                  Invite Member
                </Button>
              </form>

              {/* Team members list */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Active Workspace Users</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs">
                    <div>
                      <div className="font-semibold text-white">{user.name} (You)</div>
                      <div className="text-[10px] text-[#A1A1AA]">{user.email}</div>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-[#8B5CF6] font-semibold">Owner</span>
                  </div>

                  {invites.map((inv) => (
                    <div key={inv.email} className="flex items-center justify-between p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs">
                      <div>
                        <div className="font-semibold text-[#A1A1AA]">{inv.email}</div>
                        <div className="text-[9px] text-[#8B5CF6] font-mono mt-0.5 uppercase tracking-wide">{inv.status} invite</div>
                      </div>
                      <button
                        onClick={() => setInvites((prev) => prev.filter((i) => i.email !== inv.email))}
                        className="p-1.5 hover:bg-red-950/20 rounded text-[#A1A1AA] hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
