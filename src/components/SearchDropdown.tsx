"use client";

import Link from "next/link";
import { PostDetail, Profile } from "@/lib/types";
import { motion } from "framer-motion";
import UntrustedImage from "./UntrustedImage";
import { FileText, Users } from "lucide-react";
import Spinner from "./Spinner";

interface SearchDropdownProps {
  posts: PostDetail[];
  profiles: Profile[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ posts, profiles, isLoading, onClose }: SearchDropdownProps) {
  const hasResults = posts.length > 0 || profiles.length > 0;
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
        <div className="max-h-[60vh] overflow-y-auto">
          {profiles.length > 0 && (
            <div className="p-2">
              <h3 className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                <Users size={14} />
                <span>Users</span>
              </h3>
              <ul>
                {profiles.map((profile) => (
                  <li key={profile.name}>
                    <Link
                      href={`/profiles/${profile.name}`}
                      onClick={() => onClose()}
                      className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-white/10"
                    >
                      <UntrustedImage
                        src={profile.avatar?.url ?? "https://via.placeholder.com/40"}
                        alt={profile.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="font-semibold text-shako-off-white">{profile.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {posts.length > 0 && (
            <div className="border-t border-white/10 p-2">
              <h3 className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                <FileText size={14} />
                <span>Posts</span>
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
          )}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-400">
          <p>No results found.</p>
        </div>
      )}
    </motion.div>
  );
}
