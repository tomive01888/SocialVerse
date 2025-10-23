"use client";

import { useState } from "react";
import { CommentNode } from "@/hooks/useCommentTree";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";


interface CommentThreadProps {
  thread: CommentNode;
  postId: string;
  onCommentPosted: () => void;
}

export default function CommentThread({ thread, postId, onCommentPosted }: CommentThreadProps) {
  const [isReplyingTo, setIsReplyingTo] = useState<number | null>(null);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);

  const handleReplySuccess = () => {
    setIsReplyingTo(null);
    onCommentPosted();
  };

  return (
    <div className="flex flex-col gap-4">
      <CommentItem
        comment={thread.comment}
        onReplyClick={() => setIsReplyingTo(thread.comment.id)}
      />

      {isReplyingTo === thread.comment.id && (
        <div className="ml-14">
          <CommentForm
            postId={postId}
            replyToId={thread.comment.id}
            onCommentPosted={handleReplySuccess}
            onCancel={() => setIsReplyingTo(null)}
          />
        </div>
      )}

      {thread.replies.length > 0 && (
        <div className="ml-8 border-l-2 border-white/10 pl-6">
          <button
          type="button"
            onClick={() => setAreRepliesVisible(!areRepliesVisible)}
            className="text-sm font-bold text-purple-400 hover:underline cursor-pointer select-none"
          >
            {areRepliesVisible ? "Hide replies" : `View ${thread.replies.length} replies`}
          </button>
          
          {areRepliesVisible && (
            <div className="mt-4 flex flex-col gap-4">
              {thread.replies.map((reply) => (
                <div key={reply.id}>
                  <CommentItem
                    comment={reply}
                    onReplyClick={() => setIsReplyingTo(reply.id)}
                  />
                  {isReplyingTo === reply.id && (
                    <div className="ml-14 mt-2">
                      <CommentForm
                        postId={postId}
                        replyToId={reply.id}
                        onCommentPosted={handleReplySuccess}
                        onCancel={() => setIsReplyingTo(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}