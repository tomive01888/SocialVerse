// src/components/FeedControls.tsx
"use client";

interface FeedControlsProps {
  sort: string;
  onSortChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

export default function FeedControls({ sort, onSortChange, limit, onLimitChange }: FeedControlsProps) {
  return (
    <>
      <div>
        <label htmlFor="sort" className="block text-sm font-medium text-shako-off-white/80 mb-2">
          Sort By
        </label>
        <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value)} className="input-themed w-full">
          <option value="created">Newest</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label htmlFor="limit" className="block text-sm font-medium text-shako-off-white/80 mb-2">
          Per Page
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="input-themed w-full"
        >
          <option value={8}>8 posts</option>
          <option value={12}>12 posts</option>
          <option value={16}>16 posts</option>
        </select>
      </div>
    </>
  );
}
