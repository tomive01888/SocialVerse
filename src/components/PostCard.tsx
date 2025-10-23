"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { PostDetail } from "@/lib/types";
import { Heart, MessageCircle } from "lucide-react";
import UntrustedImage from "./UntrustedImage";

export interface PostCardProps {
  post: PostDetail;
}

const CRYSTAL_IMAGES = ["/crystallize-one.png", "/crystallize-two.png"];

export default function PostCard({ post }: PostCardProps) {
  const { userProfile } = useAuth();
  const avatarUrl = post.author?.avatar?.url ?? "https://via.placeholder.com/150";

  const crystallizeStyles = useMemo(() => {
    const image = CRYSTAL_IMAGES[Math.floor(Math.random() * CRYSTAL_IMAGES.length)];
    const randomStyles = {
      "--bg-image": `url(${image})`,
      "--bg-size": `${Math.random() * 50 + 100}%`,
      "--bg-angle": `${Math.random() * 360}deg`,
    };
    return randomStyles as React.CSSProperties;
  }, []);

  const hasUserLiked = useMemo(
    () => !!userProfile && post.reactions?.some((reaction) => reaction.reactors?.includes(userProfile.name)),
    [post.reactions, userProfile]
  );

  const hasUserCommented = useMemo(
    () => !!userProfile && post.comments?.some((comment) => comment.author?.name === userProfile.name),
    [post.comments, userProfile]
  );

  return (
    <Link href={`/posts/${post.id}`} className="no-underline hover:drop-shadow-fuchsia-900 hover:drop-shadow-xs block">
      <div
        className="crystallize-bg hover:border hover:border-fuchsia-500/30 break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl"
        style={crystallizeStyles}
      >
        <div className="w-full aspect-square bg-white/5">
          <UntrustedImage
            src={post.media?.url}
            alt={post.media?.alt || ""}
            className="object-cover object-center w-full h-full"
          />
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3 ">
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
          </div>

          <h2 className="mb-2 text-xl font-bold text-white ">{post.title}</h2>

          {post.body && <p className="mb-4 text-shako-off-white/80 line-clamp-4">{post.body}</p>}

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-gray-400">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 transition-colors ${hasUserCommented ? "text-sky-500" : ""}`}>
                <MessageCircle size={16} fill={hasUserCommented ? "currentColor" : "none"} />{" "}
                <span className="text-sm font-medium">{post._count?.comments}</span>
              </div>
              <div className={`flex items-center gap-1.5 transition-colors ${hasUserLiked ? "text-shako-accent" : ""}`}>
                <Heart size={16} fill={hasUserLiked ? "currentColor" : "none"} />{" "}
                <span className="text-sm font-medium">{post._count?.reactions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
