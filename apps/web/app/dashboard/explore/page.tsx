"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Globe, ChevronLeft, ChevronRight, Eye, CornerDownRight } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = trpc.explore.listPublicForms.useQuery({
    page,
    limit,
    search: searchQuery || undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const forms = (data?.forms || []) as any[];
  const pagination = data?.pagination;

  return (
    <div className="flex-1 min-w-0 bg-[#09090B] font-sans p-6 md:p-8 space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col gap-1 border-b border-[#27272A]/50 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Globe className="text-[#8B5CF6]" size={20} /> Explore Community Forms
        </h2>
        <p className="text-xs text-[#A1A1AA]">
          Browse, fill out, and draw inspiration from public conversational forms built on Patra.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3.5 text-[#71717A]" size={14} />
        <Input
          type="text"
          placeholder="Search public forms..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-[#111111] border-[#27272A] pl-10 text-xs text-white placeholder-[#71717A] h-9.5 focus:border-[#8B5CF6] rounded-xl"
        />
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-[#27272A] bg-[#111111]/40 animate-pulse"
            />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="border border-dashed border-[#27272A] rounded-xl bg-[#111111]/20 p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center mx-auto text-[#71717A]">
            <Globe size={16} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-white">No forms found</h3>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              We couldn&apos;t find any public published forms matching your search query.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="p-6 rounded-xl border border-[#27272A] bg-[#111111] hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between group h-44 hover:shadow-xl relative overflow-hidden"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#8B5CF6] transition-colors truncate">
                    {form.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {form.description || "No description provided."}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#27272A]/50">
                  <div className="text-[10px] text-[#71717A] font-mono">
                    <span>{form.responseCount || 0} responses</span>
                  </div>

                  <Link href={`/share/${form.slug}`} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-[#A1A1AA] hover:text-white font-semibold flex items-center gap-1.5 h-8 hover:bg-[#18181B] px-2.5 rounded-lg"
                    >
                      Fill Form <CornerDownRight size={12} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4 border-t border-[#27272A]/50">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="border-[#27272A] bg-[#111111] hover:bg-[#18181B] text-xs h-8 text-white rounded-lg px-3 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              <span className="text-xs font-mono text-[#A1A1AA]">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                className="border-[#27272A] bg-[#111111] hover:bg-[#18181B] text-xs h-8 text-white rounded-lg px-3 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
