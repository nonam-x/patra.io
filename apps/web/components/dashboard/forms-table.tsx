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
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary text-muted-foreground font-semibold">
                <th className="p-4 font-semibold text-[10px] uppercase tracking-wider text-muted-foreground/80">Name & Description</th>
                <th className="p-4 font-semibold text-[10px] uppercase tracking-wider text-muted-foreground/80">Responses</th>
                <th className="p-4 font-semibold text-[10px] uppercase tracking-wider text-muted-foreground/80">Status</th>
                <th className="p-4 font-semibold text-[10px] uppercase tracking-wider text-muted-foreground/80 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr
                  key={form.id}
                  className="border-b border-border/50 hover:bg-secondary/40 transition-colors"
                >
                  <td className="p-4 max-w-xs">
                    <Link
                      href={`/forms/${form.id}/builder`}
                      className="font-semibold text-foreground hover:text-primary transition-colors text-sm block"
                    >
                      {form.title || "Untitled Form"}
                    </Link>
                    <span className="text-[10px] text-muted-foreground truncate block mt-0.5 max-w-[250px]">
                      {form.description || "No description set"}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-foreground">
                    {form.responseCount ?? 0}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        form.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          form.status === "published" ? "bg-emerald-500" : "bg-muted-foreground/60"
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
                          className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200"
                          title="Open Builder"
                        >
                          <FormInput size={14} />
                        </Button>
                      </Link>
   
                      <Link href={`/forms/${form.id}/analytics`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200"
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
                            className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground rounded-xl">
                          <DropdownMenuItem
                            className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                            onClick={() => duplicateFormMutation.mutate({ id: form.id })}
                          >
                            <Copy size={13} />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          {form.status === "published" && (
                            <DropdownMenuItem
                              className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                              onClick={() => router.push(`/share/${form.slug}`)}
                            >
                              <ExternalLink size={13} />
                              <span>View Live Form</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-border/60" />
                          <DropdownMenuItem
                            className="hover:bg-red-50 text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
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
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {forms.map((form) => (
          <div
            key={form.id}
            className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-muted-foreground/30 transition-all duration-200 space-y-4"
          >
            {/* Title & Description */}
            <div>
              <Link
                href={`/forms/${form.id}/builder`}
                className="font-bold text-sm text-foreground hover:text-primary transition-colors block leading-snug"
              >
                {form.title || "Untitled Form"}
              </Link>
              <span className="text-[11px] text-muted-foreground block mt-1 leading-normal">
                {form.description || "No description set"}
              </span>
            </div>

            {/* Metadata (Status & Submissions) */}
            <div className="flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  form.status === "published"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-500/20"
                    : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    form.status === "published" ? "bg-emerald-500" : "bg-muted-foreground/60"
                  }`}
                />
                <span className="capitalize">{form.status || "draft"}</span>
              </span>

              <span className="text-[11px] text-muted-foreground font-medium">
                Submissions: <strong className="text-foreground font-mono font-bold ml-1">{form.responseCount ?? 0}</strong>
              </span>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-1">
              <div className="flex items-center gap-2">
                <Link href={`/forms/${form.id}/builder`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8.5 rounded-xl text-xs flex items-center gap-1.5 border-border hover:bg-secondary text-foreground transition-all duration-200 px-3 font-semibold"
                  >
                    <FormInput size={13} />
                    <span>Builder</span>
                  </Button>
                </Link>

                <Link href={`/forms/${form.id}/analytics`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8.5 rounded-xl text-xs flex items-center gap-1.5 border-border hover:bg-secondary text-foreground transition-all duration-200 px-3 font-semibold"
                  >
                    <BarChart2 size={13} />
                    <span>Analytics</span>
                  </Button>
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8.5 w-8.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200"
                  >
                    <MoreVertical size={15} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border text-foreground rounded-xl" align="end">
                  <DropdownMenuItem
                    className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                    onClick={() => duplicateFormMutation.mutate({ id: form.id })}
                  >
                    <Copy size={13} />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  {form.status === "published" && (
                    <DropdownMenuItem
                      className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                      onClick={() => router.push(`/share/${form.slug}`)}
                    >
                      <ExternalLink size={13} />
                      <span>View Live Form</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    className="hover:bg-red-50 text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                    onClick={() => handleDelete(form.id)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination View */}
      {pagination && pagination.totalPages > 1 && (
        <div className="h-12 border border-border rounded-2xl px-4 flex items-center justify-between text-xs text-muted-foreground bg-card shadow-sm">
          <span className="font-medium">
            Page {page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="hover:bg-secondary text-xs text-foreground rounded-xl px-3.5 transition-all duration-200"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= pagination.totalPages}
              onClick={() => onPageChange(page + 1)}
              className="hover:bg-secondary text-xs text-foreground rounded-xl px-3.5 transition-all duration-200"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
