"use client";

import UntrustedImage from "@/components/UntrustedImage";
import { EnrichedComment } from "@/hooks/useCommentTree";
import Link from "next/link";

interface CommentItemProps {
  comment: EnrichedComment;
  onReplyClick: () => void;
}

export default function CommentItem({ comment, onReplyClick }: CommentItemProps) {
  const authorAvatar = comment.author?.avatar?.url ?? "https://via.placeholder.com/150";
  const authorName = comment.author?.name ?? "Unknown";

  return (
    <div className="flex items-start gap-4">
      <UntrustedImage src={authorAvatar} alt={authorName} className="mt-1 h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <Link href={`/profiles/${authorName}`} className="font-semibold text-shako-off-white hover:underline">{authorName}</Link>
            <p className="text-xs text-gray-400 select-none">{new Date(comment.created).toLocaleDateString()}</p>
            <p className="text-xs font-mono text-gray-500 select-none">#{comment.id}</p>
          </div>
          <span className="text-xs font-mono text-gray-500 select-none">{comment?.replyToId === null ? "" : `#${comment.replyToId}`}</span>
        </div>
        <p className="text-shako-off-white/90">
          {comment.replyingToName && (
            <Link href={`/profiles/${comment.replyingToName}`} className="mr-1 font-semibold text-purple-400 hover:underline">
              @{comment.replyingToName}
            </Link>
          )}
          {comment.body}
        </p>
        <button type="button" onClick={onReplyClick} className="mt-1 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer select-none">
          Reply
        </button>
      </div>
    </div>
  );
}