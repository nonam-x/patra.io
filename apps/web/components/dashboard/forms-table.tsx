"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormInput,
  BarChart2,
  MoreVertical,
  Copy,
  ExternalLink,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";

interface FormItem {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  responseCount: number;
  createdAt: string;
}

interface FormsTableProps {
  forms: FormItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  page: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export function FormsTable({
  forms,
  pagination,
  page,
  onPageChange,
  onRefetch,
}: FormsTableProps) {
  const router = useRouter();

  const deleteFormMutation = trpc.form.delete.useMutation({
    onSuccess: () => {
      toast.success("Form deleted successfully");
      onRefetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete form");
    },
  });

  const duplicateFormMutation = trpc.form.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Form duplicated successfully");
      onRefetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to duplicate form");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      deleteFormMutation.mutate({ id });
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary text-muted-foreground font-semibold font-mono">
              <th className="p-4">Name & Description</th>
              <th className="p-4">Responses</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={form.id}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="p-4 max-w-xs">
                  <Link
                    href={`/forms/${form.id}/builder`}
                    className="font-bold text-foreground hover:text-primary transition-colors text-sm block"
                  >
                    {form.title || "Untitled Form"}
                  </Link>
                  <span className="text-[10px] text-muted-foreground truncate block mt-0.5 max-w-[250px]">
                    {form.description || "No description set"}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-foreground">
                  {form.responseCount ?? 0}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      form.status === "published"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        form.status === "published" ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    />
                    <span className="capitalize">{form.status || "draft"}</span>
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Link href={`/forms/${form.id}/builder`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Open Builder"
                      >
                        <FormInput size={14} />
                      </Button>
                    </Link>
 
                    <Link href={`/forms/${form.id}/analytics`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Analytics"
                      >
                        <BarChart2 size={14} />
                      </Button>
                    </Link>
 
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                          className="hover:bg-muted cursor-pointer flex items-center gap-2 text-xs"
                          onClick={() => duplicateFormMutation.mutate({ id: form.id })}
                        >
                          <Copy size={13} />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        {form.status === "published" && (
                          <DropdownMenuItem
                            className="hover:bg-muted cursor-pointer flex items-center gap-2 text-xs"
                            onClick={() => router.push(`/share/${form.slug}`)}
                          >
                            <ExternalLink size={13} />
                            <span>View Live Form</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="hover:bg-red-500/10 text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-2 text-xs"
                          onClick={() => handleDelete(form.id)}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {pagination && pagination.totalPages > 1 && (
        <div className="h-12 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/30 font-mono">
          <span>
            Page {page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="hover:bg-muted text-xs text-foreground"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= pagination.totalPages}
              onClick={() => onPageChange(page + 1)}
              className="hover:bg-muted text-xs text-foreground"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
