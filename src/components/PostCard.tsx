"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import type { PostDetail } from "@/lib/types";
import { Heart, MessageCircle } from "lucide-react";
import UntrustedImage from "./UntrustedImage";
import PostOptions from "./PostOptions";
import toast from "react-hot-toast";

interface PostCardProps {
  post: PostDetail;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CRYSTAL_IMAGES = ["/crystallize-one.png", "/crystallize-two.png"];

export default function PostCard({ post, isOwner = false, onEdit, onDelete }: PostCardProps) {
  const { accessToken, userProfile } = useAuth();
  const avatarUrl = post.author?.avatar?.url ?? "https://via.placeholder.com/150";

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReacting, setIsReacting] = useState(false);

  const crystallizeStyles = useMemo(() => {
    const image = CRYSTAL_IMAGES[Math.floor(Math.random() * CRYSTAL_IMAGES.length)];

    const randomStyles = {
      "--bg-image": `url(${image})`,
      "--bg-size": `${Math.random() * 50 + 100}%`,
      "--bg-angle": `${Math.random() * 360}deg`,
    };
    return randomStyles as React.CSSProperties;
  }, []);

  useEffect(() => {
    setLikeCount(post._count?.reactions ?? 0);

    const userHasLiked = !!(
      userProfile && post.reactions?.find((reaction) => reaction.symbol === "❤️")?.reactors?.includes(userProfile.name)
    );

    setIsLiked(userHasLiked);
  }, [post.reactions, post._count?.reactions, userProfile]);

  const handleLike = async () => {
    if (!accessToken) {
      toast.error("You must be logged in to like a post.");
      return;
    }
    if (isReacting) return;

    setIsReacting(true);

    const originalLikedState = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      await authenticatedFetch(`/social/posts/${post.id}/react/❤️`, {
        method: "PUT",
        token: accessToken,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update reaction.";
      toast.error(errorMessage);
      setIsLiked(originalLikedState);
      setLikeCount(originalLikeCount);
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <Link href={`/posts/${post.id}`} className="no-underline hover:drop-shadow-fuchsia-900 hover:drop-shadow-xs ">
      <div
        className="crystallize-bg hover:border-1 hover:border-fuchsia-500/30 break-inside-avoid mb-4 overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl"
        style={crystallizeStyles}
      >
        <UntrustedImage src={post.media?.url} alt={post.media?.alt || ""} className="w-full object-cover" />

        <div className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <UntrustedImage
                src={avatarUrl}
                alt={post.author?.name || ""}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-shako-off-white">{post.author?.name}</h3>
                <p className="text-xs text-gray-400">{new Date(post.created).toLocaleDateString()}</p>
              </div>
            </div>
            {isOwner && onEdit && onDelete && <PostOptions onEdit={onEdit} onDelete={onDelete} />}
          </div>

          <h2 className="mb-2 text-xl font-bold text-white ">{post.title}</h2>

          {post.body && <p className="mb-4 text-shako-off-white/80 line-clamp-4">{post.body}</p>}

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MessageCircle size={16} />
                <span className="text-sm font-medium">{post._count?.comments}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={16} className={isLiked ? "text-shako-accent" : ""} />
                <span className="text-sm font-medium">{likeCount}</span>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={handleLike}
                disabled={isReacting}
                className={`rounded-full p-2 transition-colors disabled:cursor-not-allowed ${
                  isLiked ? "text-shako-accent" : "text-gray-400 hover:text-shako-accent"
                }`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
