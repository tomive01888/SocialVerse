"use client";

import PostCard from "@/components/PostCard";
import { PostDetail } from "@/lib/types";
import PostOptions from "@/app/(protected)/posts/[id]/components/PostOptions";

interface ManagePostCardProps {
  isOwner: boolean;
  post: PostDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ManagePostCard({ isOwner, post, onEdit, onDelete }: ManagePostCardProps) {
  return (
    <article className="break-inside-avoid rounded bg-shako-dark/50">
      <PostCard post={post} />
      {isOwner && (

        <div className="bg-shako-dark/50 rounded">
        <PostOptions onDelete={onDelete} onEdit={onEdit} />
      </div>
        )}
    </article>
  );
}
