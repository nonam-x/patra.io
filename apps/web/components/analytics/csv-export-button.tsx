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
  submittedAt?: string;
  completedAt?: string | null | Date | any;
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
      const dateValue = sub.completedAt || sub.submittedAt;
      const safeDateStr = dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();
      const rowData = [
        sub.id,
        safeDateStr,
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
      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold w-8 h-8 sm:w-auto sm:px-4 sm:h-8.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm p-0 sm:p-auto"
    >
      <Download size={13} className="shrink-0" />
      <span className="hidden sm:inline">Export CSV</span>
    </Button>
  );
}
