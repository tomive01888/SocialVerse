"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/general/Spinner";
import { PostDetail, Meta, PaginatedApiResponse } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import CreatePostButton from "@/components/CreatePostButton";
import AuthorsOnPage from "@/components/AuthorsOnPage";
import { buildUrl } from "@/lib/urlBuilder";

export default function HomePage() {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created");

  const fetchPosts = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = buildUrl("/social/posts", {
        _author: true,
        _comments: true,
        _reactions: true,
        sort: String(sort),
        sortOrder: String("desc"),
        limit: String(limit),
        page: String(page),
      });

      const response = await authenticatedFetch<PaginatedApiResponse<PostDetail[]>>(apiUrl, { token: accessToken });

      setPosts(response.data);
      setPaginationMeta(response.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, page, limit, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const shouldShowPagination = paginationMeta && paginationMeta.pageCount > 1;

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 p-4 lg:grid-cols-[1fr_320px]">
      <section aria-label="Posts feed">
        {isLoading ? (
          <AnimatePresence>
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-shako-dark/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="status"
              aria-live="polite"
              aria-label="Loading posts"
            >
              <Spinner />
            </motion.div>
          </AnimatePresence>
        ) : error ? (
          <div className="text-center text-shako-accent" role="alert" aria-live="assertive">
            Error: {error}
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <section
                className="columns-1 sm:columns-2 xl:columns-3 space-y-4"
                role="feed"
                aria-label="Social media posts"
                aria-busy={isLoading}
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </section>
            ) : (
              <p className="text-center text-gray-400" role="status">
                No posts to show.
              </p>
            )}

            {shouldShowPagination && (
              <nav className="mt-8 flex items-center justify-center gap-4" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={paginationMeta.isFirstPage}
                  className="cursor-pointer rounded-md bg-aurora-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-aurora-blue/80 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-shako-indigo disabled:hover:bg-shako-indigo disabled:hover:shadow-sm"
                  aria-label="Go to previous page"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-shako-off-white/80" aria-current="page" aria-live="polite">
                  Page {paginationMeta.currentPage} of {paginationMeta.pageCount}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={paginationMeta.isLastPage}
                  className="cursor-pointer rounded-md bg-aurora-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-aurora-blue/80 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-shako-indigo disabled:hover:bg-shako-indigo disabled:hover:shadow-sm"
                  aria-label="Go to next page"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      <motion.aside
        className="h-fit w-full lg:sticky lg:top-28 row-start-1 lg:row-start-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        aria-label="Filters and options"
      >
        <div className="flex flex-col gap-6 rounded-lg border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur-sm">
          <CreatePostButton onPostCreated={fetchPosts} />

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-shako-off-white/80 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-themed w-full"
              aria-describedby="sort-description"
            >
              <option value="created">Newest</option>
              <option value="title">Title</option>
            </select>
            <span id="sort-description" className="sr-only">
              Choose how to sort the posts displayed
            </span>
          </div>
          <div>
            <label htmlFor="limit" className="block text-sm font-medium text-shako-off-white/80 mb-2">
              Per Page
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="input-themed w-full"
              aria-describedby="limit-description"
            >
              <option value={8}>8 posts</option>
              <option value={12}>12 posts</option>
              <option value={16}>16 posts</option>
            </select>
            <span id="limit-description" className="sr-only">
              Choose how many posts to display per page
            </span>
          </div>
          <AuthorsOnPage posts={posts} />
        </div>
      </motion.aside>
    </div>
  );
}
