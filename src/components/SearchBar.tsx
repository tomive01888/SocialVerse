"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { buildUrl } from "@/lib/urlBuilder";
import { useDebounce } from "@/hooks/useDebounce";
import { PostDetail } from "@/lib/types";
import SearchDropdown from "./SearchDropdown";
import toast from "react-hot-toast";

export default function SearchBar() {
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{ posts: PostDetail[]; isLoading: boolean }>({
    posts: [],
    isLoading: false,
  });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery && accessToken) {
      const performSearch = async () => {
        setSearchResults({ posts: [], isLoading: true });
        try {
          const postSearchUrl = buildUrl(`/social/posts/search`, {
            q: debouncedSearchQuery,
            _author: true,
            _reactions: true,
          });
          const postResponse = await authenticatedFetch<{ data: PostDetail[] }>(postSearchUrl, { token: accessToken });
          const sortedPosts = postResponse.data.sort(
            (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
          );
          setSearchResults({ posts: sortedPosts, isLoading: false });
        } catch (searchError) {
          const errorMessage = searchError instanceof Error ? searchError.message : "Search failed to complete.";
          toast.error(errorMessage);
          setSearchResults({ posts: [], isLoading: false });
        }
      };
      performSearch();
    } else {
      setSearchResults({ posts: [], isLoading: false });
    }
  }, [debouncedSearchQuery, accessToken]);

  return (
    <div className="relative">
      <label htmlFor="search" className="block text-sm font-sans font-medium text-shako-off-white/80 mb-2">
        Search Posts
      </label>
      <input
        id="search"
        type="text"
        placeholder="Find a post..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        className="input-themed w-full"
        autoComplete="off"
      />
      {isSearchFocused && searchQuery && (
        <SearchDropdown
          posts={searchResults.posts.slice(0, 10)}
          isLoading={searchResults.isLoading}
          onClose={() => setIsSearchFocused(false)}
        />
      )}
    </div>
  );
}
