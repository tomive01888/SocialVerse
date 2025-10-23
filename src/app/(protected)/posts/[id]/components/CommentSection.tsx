"use client";

import { useCommentTree } from "@/hooks/useCommentTree";
import { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdate: () => void;
}

export default function CommentsSection({ postId, comments, onCommentsUpdate }: CommentsSectionProps) {
  const nestedComments = useCommentTree(comments);

  return (
    <div>
      <h3 className="text-lg font-semibold text-shako-off-white">{comments.length} Comments</h3>

      <div className="my-6">
        <CommentForm postId={postId} onCommentPosted={onCommentsUpdate} />
      </div>

      <div className="flex flex-col gap-8">
        {nestedComments.map((comment) => (
          <CommentThread key={comment.id} comment={comment} postId={postId} onCommentPosted={onCommentsUpdate} />
        ))}
      </div>
    </div>
  );
}
