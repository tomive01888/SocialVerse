// src/components/SearchDropdown.tsx
"use client";
import Link from "next/link";
import { PostDetail } from "@/lib/types";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Spinner from "./general/Spinner";

interface SearchDropdownProps {
  posts: PostDetail[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ posts, isLoading, onClose }: SearchDropdownProps) {
  const hasResults = posts.length > 0;

  return (
    <motion.div
      className="absolute top-full mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-shako-dark shadow-2xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <Spinner />
        </div>
      ) : hasResults ? (
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <h3 className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-400">
            <FileText size={14} />
            <span>Matching Posts</span>
          </h3>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  onClick={() => onClose()}
                  className="block rounded-md p-3 transition-colors hover:bg-white/10"
                >
                  <p className="font-semibold text-shako-off-white truncate">{post.title}</p>
                  <p className="text-sm text-gray-400 truncate">by {post.author?.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-400">
          <p>No posts found.</p>
        </div>
      )}
    </motion.div>
  );
}
