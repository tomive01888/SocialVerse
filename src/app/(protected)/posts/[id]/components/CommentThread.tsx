"use client";
import { useState } from "react";
import UntrustedImage from "@/components/UntrustedImage";
import CommentForm from "./CommentForm";
import { CommentNode } from "@/hooks/useCommentTree";

interface CommentThreadProps {
  comment: CommentNode;
  postId: string;
  onCommentPosted: () => void;
}

function SingleComment({ comment, onReplyClick }: { comment: CommentNode; onReplyClick: () => void }) {
  const authorAvatar = comment.author?.avatar?.url ?? "https://via.placeholder.com/40";
  const authorName = comment.author?.name ?? "Unknown";

  return (
    <div className="flex items-start gap-4">
      <UntrustedImage src={authorAvatar} alt={authorName} className="mt-1 h-10 w-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold text-shako-off-white">{authorName}</p>
          <p className="text-xs text-gray-400">{new Date(comment.created).toLocaleDateString()}</p>
        </div>
        <p className="text-shako-off-white/90">{comment.body}</p>
        <button onClick={onReplyClick} className="mt-1 text-xs font-semibold text-gray-400 hover:text-white">
          Reply
        </button>
      </div>
    </div>
  );
}

export default function CommentThread({ comment, postId, onCommentPosted }: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <SingleComment comment={comment} onReplyClick={() => setIsReplying(!isReplying)} />

      {isReplying && (
        <div className="ml-14">
          <CommentForm
            postId={postId}
            replyToId={comment.id}
            onCommentPosted={onCommentPosted}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="ml-8 border-l-2 border-white/10 pl-6">
          <button
            onClick={() => setAreRepliesVisible(!areRepliesVisible)}
            className="text-sm font-bold text-aurora-pink hover:underline"
          >
            {areRepliesVisible ? "Hide replies" : `View ${comment.replies.length} replies`}
          </button>

          {areRepliesVisible && (
            <div className="mt-4 flex flex-col gap-4">
              {comment.replies.map((reply) => (
                <CommentThread key={reply.id} comment={reply} postId={postId} onCommentPosted={onCommentPosted} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
