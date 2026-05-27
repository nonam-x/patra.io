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
      <div className="border border-border rounded-xl bg-card p-12 text-center text-xs text-muted-foreground">
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
          <h4 className="text-sm font-semibold text-foreground">Submissions</h4>
          <p className="text-xs text-muted-foreground">Browse and expand individual responses.</p>
        </div>
        <span className="text-[10px] bg-secondary border border-border px-2.5 py-1 rounded-lg text-muted-foreground font-medium">
          {submissions.length} Total
        </span>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-medium select-none">
                <th className="p-4 w-10"></th>
                <th className="p-4">ID</th>
                <th className="p-4">Submitted</th>
                {previewFields.map((f) => (
                  <th key={f.id} className="p-4 truncate max-w-[150px] hidden sm:table-cell">
                    {f.label}
                  </th>
                ))}
                {fields.length > 3 && <th className="p-4 text-muted-foreground/60 hidden sm:table-cell">+{fields.length - 3} more</th>}
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
                      className={`group border-b border-border/30 hover:bg-secondary/30 transition-all duration-200 cursor-pointer select-none ${
                        isExpanded ? "bg-secondary/20" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={14} className="text-muted-foreground" />
                        )}
                      </td>
                      <td className="p-4 text-[10px] text-primary font-medium">
                        <button
                          onClick={(e) => copyToClipboard(sub.id, e)}
                          className="flex items-center gap-1 hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-secondary select-none text-left"
                          title="Click to copy full ID"
                        >
                          <span>#{sub.id.slice(0, 8)}</span>
                          {copiedId === sub.id ? (
                            <Check size={10} className="text-emerald-600" />
                          ) : (
                            <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(sub.completedAt || sub.submittedAt || new Date()).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      {previewFields.map((f) => {
                        const ans = sub.answers?.find((a) => a.fieldId === f.id);
                        return (
                          <td
                            key={f.id}
                            className="p-4 text-foreground font-medium truncate max-w-[150px] hidden sm:table-cell"
                          >
                            {ans?.value?.toString() || "—"}
                          </td>
                        );
                      })}
                      {fields.length > 3 && <td className="p-4 text-muted-foreground/60 italic hidden sm:table-cell">Details</td>}
                    </tr>

                    {/* Expandable answers detail box */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={3 + previewFields.length + (fields.length > 3 ? 1 : 0)} className="p-0 bg-secondary/10 border-b border-border/30">
                          <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
                            <div className="flex justify-between items-center border-b border-border/30 pb-2">
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-primary/60" />
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  Submission Detail
                                </span>
                              </div>
                              <button
                                onClick={(e) => copyToClipboard(sub.id, e)}
                                className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors bg-card hover:bg-secondary px-2 py-1 rounded-md border border-border"
                              >
                                <span className="hidden sm:inline">ID: {sub.id}</span>
                                <span className="inline sm:hidden">ID: #{sub.id.slice(0, 8)}</span>
                                {copiedId === sub.id ? (
                                  <Check size={10} className="text-emerald-600" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {fields.map((f) => {
                                const ans = sub.answers?.find((a) => a.fieldId === f.id);
                                return (
                                  <div
                                    key={f.id}
                                    className="p-3 rounded-lg border border-border/40 bg-card space-y-1"
                                  >
                                    <span className="text-[9px] font-medium text-muted-foreground block">
                                      {f.label}
                                    </span>
                                    <span className="text-xs text-foreground font-medium">
                                      {ans?.value?.toString() || <span className="text-muted-foreground italic">No response</span>}
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
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-border/30 px-4 pb-4 bg-secondary/10 select-none">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                setExpandedSubId(null);
              }}
              className="border-border bg-card hover:bg-secondary text-xs h-8 text-foreground rounded-lg px-2 sm:px-3 flex items-center gap-1 active:scale-[0.98] transition-all duration-200"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <span className="text-xs text-muted-foreground font-medium">
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
              className="border-border bg-card hover:bg-secondary text-xs h-8 text-foreground rounded-lg px-2 sm:px-3 flex items-center gap-1 active:scale-[0.98] transition-all duration-200"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
