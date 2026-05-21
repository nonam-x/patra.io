"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

interface Answer {
  fieldId: string;
  value: string;
}

interface Submission {
  id: string;
  submittedAt: string;
  answers: Answer[];
}

interface Field {
  id: string;
  label: string;
}

interface CSVExportButtonProps {
  submissions: Submission[];
  fields: Field[];
  formTitle: string;
}

export function CSVExportButton({ submissions, fields, formTitle }: CSVExportButtonProps) {
  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No submissions available to export");
      return;
    }

    // Build header row
    const headers = ["Submission ID", "Submitted At", ...fields.map((f) => f.label || `Field_${f.id}`)];
    const csvRows = [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",")];

    // Build data rows
    submissions.forEach((sub) => {
      const rowData = [
        sub.id,
        new Date(sub.submittedAt).toISOString(),
        ...fields.map((f) => {
          const ans = sub.answers?.find((a) => a.fieldId === f.id);
          const valStr = ans?.value ? ans.value.toString().replace(/"/g, '""') : "";
          return `"${valStr}"`;
        }),
      ];
      csvRows.push(rowData.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `patra_responses_${formTitle.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <Button
      onClick={handleExportCSV}
      disabled={submissions.length === 0}
      className="bg-white hover:bg-white/90 text-black text-xs font-bold px-2.5 sm:px-4 h-9 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={13} />
      <span className="hidden sm:inline">Export CSV</span>
    </Button>
  );
}
