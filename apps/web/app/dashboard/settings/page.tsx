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
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Header } from "~/components/app/header";
import { toast } from "sonner";
import { trpc } from "~/trpc/client";

export default function SettingsPage() {
  const { user } = useAuthGuard();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"workspace" | "billing" | "api" | "team" | "emails">("workspace");

  // Email logs state
  const [emailPage, setEmailPage] = useState(1);
  const emailLogs = trpc.email.list.useQuery(
    { page: emailPage, limit: 20 },
    { enabled: activeTab === "emails" },
  );

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
        <div className="flex border-b border-border/50 gap-6 text-xs pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer shrink-0 ${
              activeTab === "workspace" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Workspace Info
            {activeTab === "workspace" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer shrink-0 ${
              activeTab === "billing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Billing & Usage
            {activeTab === "billing" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer shrink-0 ${
              activeTab === "api" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            API Keys & Webhooks
            {activeTab === "api" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer shrink-0 ${
              activeTab === "team" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Team Members
            {activeTab === "team" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer shrink-0 ${
              activeTab === "emails" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Email Logs
            {activeTab === "emails" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
        </div>

        {/* TAB 1: WORKSPACE INFO */}
        {activeTab === "workspace" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">General Details</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Modify metadata relating to your creator organization.</p>
            </div>

            <div className="space-y-4 border border-border rounded-2xl p-6 bg-card">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground/80">Workspace Name</label>
                <Input defaultValue="Patra Workspace" className="bg-background border-border text-xs focus-visible:ring-primary text-foreground rounded-xl h-9.5" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground/80">Support Contact Email</label>
                <Input defaultValue={user.email} className="bg-background border-border text-xs focus-visible:ring-primary text-foreground rounded-xl h-9.5" />
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8.5 rounded-xl transition-all duration-200" onClick={() => toast.success("Workspace saved")}>
                Save Settings
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: BILLING & USAGE */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Subscription Profile</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Review your usage limits, invoices, and active tier features.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Plan */}
              <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold font-mono">Current Plan</span>
                    <h4 className="text-lg font-bold text-foreground capitalize">{user.plan} Account</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/5 border border-primary/20 text-primary font-mono">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Monthly Responses Usage</span>
                    <span className="text-foreground font-mono font-medium">152 / 10,000</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "1.5%" }} />
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="border-border hover:bg-secondary text-xs text-foreground rounded-xl h-8.5 transition-all duration-200" onClick={() => toast.info("Stripe portal simulated.")}>
                    Update payment method <ExternalLink size={12} className="ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Plan Highlights */}
              <div className="border border-border rounded-2xl p-6 bg-card space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Features Included</h4>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Unlimited forms and submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>AI generation modal assistants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Workspace API Keys</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Use these keys to access form data via our HTTP services.</p>
              </div>

              <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
                <div className="flex gap-3 max-w-md">
                  <Input
                    placeholder="API Key label (e.g. Retool)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-background border-border text-xs focus-visible:ring-primary text-foreground rounded-xl h-8.5"
                  />
                  <Button onClick={handleGenerateKey} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 h-8.5 rounded-xl transition-all duration-200">
                    Generate Key
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border text-xs">
                      <div>
                        <div className="font-semibold text-foreground">{key.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{key.key}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          {copiedKeyId === key.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                        <button
                          onClick={() => setApiKeys((prev) => prev.filter((k) => k.id !== key.id))}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-500 transition-all duration-200"
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
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Event Webhooks</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Configure endpoints to receive payload notifications on submission triggers.</p>
              </div>

              <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
                <div className="flex gap-3 max-w-md">
                  <Input
                    placeholder="Webhook endpoint URL (HTTPS)"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="bg-background border-border text-xs focus-visible:ring-primary text-foreground rounded-xl h-8.5"
                  />
                  <Button onClick={handleAddWebhook} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 h-8.5 rounded-xl transition-all duration-200 border-none">
                    Add URL
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {webhooks.map((hook) => (
                    <div key={hook.id} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border text-xs">
                      <div className="overflow-hidden pr-4">
                        <div className="font-mono text-foreground truncate">{hook.url}</div>
                        <div className="text-[10px] text-primary font-mono mt-0.5">{hook.event}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-500/20 text-[9px] font-bold font-mono">
                          ACTIVE
                        </span>
                        <button
                          onClick={() => setWebhooks((prev) => prev.filter((h) => h.id !== hook.id))}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-500 transition-all duration-200"
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
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Collaborators</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Manage users authorized to access and modify workspace forms.</p>
            </div>

            <div className="border border-border rounded-2xl p-6 bg-card space-y-6">
              {/* Invite form */}
              <form onSubmit={handleSendInvite} className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="partner@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-background border-border text-xs focus-visible:ring-primary text-foreground rounded-xl h-8.5"
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 h-8.5 rounded-xl transition-all duration-200">
                  Invite Member
                </Button>
              </form>

              {/* Team members list */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Active Workspace Users</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{user.name} (You)</div>
                      <div className="text-[10px] text-muted-foreground">{user.email}</div>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-primary font-semibold">Owner</span>
                  </div>

                  {invites.map((inv) => (
                    <div key={inv.email} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border text-xs">
                      <div>
                        <div className="font-semibold text-muted-foreground">{inv.email}</div>
                        <div className="text-[9px] text-primary font-mono mt-0.5 uppercase tracking-wide">{inv.status} invite</div>
                      </div>
                      <button
                        onClick={() => setInvites((prev) => prev.filter((i) => i.email !== inv.email))}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-500 transition-all duration-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
      </div>
      )
    }

    {/* TAB 5: EMAIL LOGS */}
    {activeTab === "emails" && (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Mail size={16} className="text-primary" /> Email Logs
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simulated email notifications sent when respondents submit forms. In production, these would be real emails via Resend or SendGrid.
          </p>
        </div>

        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          {emailLogs.isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading email logs...
            </div>
          ) : !emailLogs.data || emailLogs.data.emails.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
                <Mail size={18} />
              </div>
              <p className="text-xs text-muted-foreground">
                No email logs yet. Submit a form response to generate notifications.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-3 font-semibold text-muted-foreground">To</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Subject</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Type</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Sent At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.data.emails.map((email: any) => (
                      <tr key={email.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground font-medium truncate max-w-[180px]">{email.to}</td>
                        <td className="p-3 text-foreground truncate max-w-[260px]" title={email.subject}>{email.subject}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                            email.type === "creator_notification"
                              ? "bg-blue-50 text-blue-600 border border-blue-200/40"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200/40"
                          }`}>
                            {email.type === "creator_notification" ? "Creator Alert" : "Respondent Receipt"}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground font-mono text-[10px]">
                          {email.createdAt ? new Date(email.createdAt as string).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {emailLogs.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-3 border-t border-border/50 bg-secondary/10">
                  <span className="text-[10px] text-muted-foreground">
                    Page {emailLogs.data.pagination.page} of {emailLogs.data.pagination.totalPages} • {emailLogs.data.pagination.total} total
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={emailPage <= 1}
                      onClick={() => setEmailPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={emailPage >= emailLogs.data.pagination.totalPages}
                      onClick={() => setEmailPage((p) => p + 1)}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}
      </div>
    </>
  );
}
