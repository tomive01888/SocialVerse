// src/components/AuthorsOnPage.tsx
"use client";
import Link from "next/link";
import { PostDetail } from "@/lib/types";
import { useMemo } from "react";
import UntrustedImage from "./UntrustedImage";
import { Users } from "lucide-react";

interface AuthorsOnPageProps {
  posts: PostDetail[];
}

export default function AuthorsOnPage({ posts }: AuthorsOnPageProps) {
  const uniqueAuthors = useMemo(() => {
    const authors = new Map();
    posts.forEach((post) => {
      if (post.author && !authors.has(post.author.name)) {
        authors.set(post.author.name, post.author);
      }
    });
    return Array.from(authors.values());
  }, [posts]);

  if (uniqueAuthors.length === 0) {
    return null;
  }

  return (
    <nav aria-labelledby="authors-heading">
      <h3
        id="authors-heading"
        className="mb-2 flex items-center gap-2 text-sm font-sans font-medium text-shako-off-white/80"
      >
        <Users size={16} aria-hidden="true" />
        <span>Authors on this Page</span>
      </h3>
      <ul className="space-y-2" role="list">
        {uniqueAuthors.map((author) => (
          <li key={author.name}>
            <Link
              href={`/profiles/${author.name}`}
              className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/10"
              aria-label={`View profile of ${author.name}`}
            >
              <UntrustedImage
                src={author.avatar?.url ?? "https://via.placeholder.com/40"}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
                aria-hidden="true"
              />
              <span className="font-semibold text-shako-off-white/90 transition-colors group-hover:text-white">
                {author.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
