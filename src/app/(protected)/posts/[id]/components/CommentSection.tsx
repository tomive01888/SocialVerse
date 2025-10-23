"use client";

import { Comment } from "@/lib/types";
import { useCommentTree } from "@/hooks/useCommentTree";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdate: () => void;
}

export default function CommentsSection({ postId, comments, onCommentsUpdate }: CommentsSectionProps) {
  const commentThreads = useCommentTree(comments);

  return (
    <div>
      <h3 className="text-lg font-semibold text-shako-off-white">{comments.length} Comments</h3>
      <div className="my-6">
        <CommentForm postId={postId} onCommentPosted={onCommentsUpdate} />
      </div>
      <div className="flex flex-col gap-8">
        {commentThreads.map((thread) => (
          <CommentThread key={thread.comment.id} thread={thread} postId={postId} onCommentPosted={onCommentsUpdate} />
        ))}
      </div>
    </div>
  );
}