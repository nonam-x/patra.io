import React, { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Hash, FileText, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

interface Answer {
  fieldId: string;
  value: string;
}

interface Submission {
  id: string;
  formId: string;
  startedAt: string | null;
  completedAt: string;
  submittedAt: string;
  answers: Answer[];
}

interface Field {
  id: string;
  type: string;
  label: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  fields: Field[];
}

export function SubmissionsTable({ submissions, fields }: SubmissionsTableProps) {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pageSize = 10;

  const toggleExpand = (id: string) => {
    setExpandedSubId(expandedSubId === id ? null : id);
  };

  const copyToClipboard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Submission ID copied to clipboard", {
      description: id,
    });
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="border border-[#27272A] rounded-xl bg-[#111111] p-12 text-center text-xs text-[#71717A] font-mono">
        No submissions received yet.
      </div>
    );
  }

  // Calculate pagination details
  const totalSubmissions = submissions.length;
  const totalPages = Math.ceil(totalSubmissions / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSubmissions = submissions.slice(startIndex, endIndex);

  // Filter content fields to display as table columns (limit to first 3 to prevent overflow)
  const previewFields = fields.slice(0, 3);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-white">Submissions Log</h4>
          <p className="text-xs text-[#A1A1AA]">Browse and expand individual form responses.</p>
        </div>
        <span className="text-[10px] bg-[#18181B] border border-[#27272A] px-2.5 py-1 rounded-lg text-[#A1A1AA] font-mono">
          {submissions.length} Total
        </span>
      </div>

      <div className="border border-[#27272A] rounded-xl bg-[#111111] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#18181B] text-[#A1A1AA] font-semibold select-none">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-mono">Submission ID</th>
                <th className="p-4">Submitted At</th>
                {previewFields.map((f) => (
                  <th key={f.id} className="p-4 truncate max-w-[150px]">
                    {f.label}
                  </th>
                ))}
                {fields.length > 3 && <th className="p-4 text-[#71717A] font-mono">+{fields.length - 3} more</th>}
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map((sub) => {
                const isExpanded = expandedSubId === sub.id;

                return (
                  <React.Fragment key={sub.id}>
                    {/* Row header */}
                    <tr
                      onClick={() => toggleExpand(sub.id)}
                      className={`group border-b border-[#27272A]/50 hover:bg-[#18181B]/40 transition-colors cursor-pointer select-none ${
                        isExpanded ? "bg-[#18181B]/30" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-[#A1A1AA]" />
                        ) : (
                          <ChevronDown size={14} className="text-[#A1A1AA]" />
                        )}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-[#8B5CF6] font-semibold">
                        <button
                          onClick={(e) => copyToClipboard(sub.id, e)}
                          className="flex items-center gap-1 hover:text-[#a78bfa] transition-colors p-1 rounded-md hover:bg-[#18181B] select-none text-left"
                          title="Click to copy full ID"
                        >
                          <span>#{sub.id.slice(0, 8)}</span>
                          {copiedId === sub.id ? (
                            <Check size={10} className="text-emerald-400" />
                          ) : (
                            <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A1A1AA]" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-[#A1A1AA]">
                        {new Date(sub.submittedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      {previewFields.map((f) => {
                        const ans = sub.answers?.find((a) => a.fieldId === f.id);
                        return (
                          <td
                            key={f.id}
                            className="p-4 text-[#FAFAFA] font-medium truncate max-w-[150px]"
                          >
                            {ans?.value?.toString() || "—"}
                          </td>
                        );
                      })}
                      {fields.length > 3 && <td className="p-4 text-[#71717A] italic">Details</td>}
                    </tr>

                    {/* Expandable answers detail box */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={3 + previewFields.length + (fields.length > 3 ? 1 : 0)} className="p-0 bg-[#18181B]/20 border-b border-[#27272A]/50">
                          <div className="p-6 space-y-4 max-w-3xl mx-auto">
                            <div className="flex justify-between items-center border-b border-[#27272A]/50 pb-2">
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-[#8B5CF6]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#A1A1AA]">
                                  Submission Detail View
                                </span>
                              </div>
                              <button
                                onClick={(e) => copyToClipboard(sub.id, e)}
                                className="flex items-center gap-1.5 text-[10px] font-mono text-[#71717A] hover:text-[#FAFAFA] transition-colors bg-[#111111] hover:bg-[#18181B] px-2 py-1 rounded-md border border-[#27272A]"
                              >
                                <span className="hidden sm:inline">ID: {sub.id}</span>
                                <span className="inline sm:hidden">ID: #{sub.id.slice(0, 8)}</span>
                                {copiedId === sub.id ? (
                                  <Check size={10} className="text-emerald-400" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fields.map((f) => {
                                const ans = sub.answers?.find((a) => a.fieldId === f.id);
                                return (
                                  <div
                                    key={f.id}
                                    className="p-3 rounded-lg border border-[#27272A]/50 bg-[#111111]/80 space-y-1"
                                  >
                                    <span className="text-[9px] font-bold font-mono text-[#71717A] uppercase block">
                                      {f.label}
                                    </span>
                                    <span className="text-xs text-white font-medium">
                                      {ans?.value?.toString() || <span className="text-[#71717A] italic">No response</span>}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-[#27272A]/50 px-4 pb-4 bg-[#18181B]/10 select-none">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                setExpandedSubId(null);
              }}
              className="border-[#27272A] bg-[#111111] hover:bg-[#18181B] text-xs h-8 text-white rounded-lg px-3 flex items-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <ChevronLeft size={14} /> Previous
            </Button>
            
            <span className="text-xs font-mono text-[#A1A1AA]">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                setExpandedSubId(null);
              }}
              className="border-[#27272A] bg-[#111111] hover:bg-[#18181B] text-xs h-8 text-white rounded-lg px-3 flex items-center gap-1.5 active:scale-[0.98] transition-all"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
