"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import toast from "react-hot-toast";

interface CommentFormProps {
  postId: string;
  onCommentPosted: () => void;
  replyToId?: number;
  onCancel?: () => void;
}

export default function CommentForm({ postId, onCommentPosted, replyToId, onCancel }: CommentFormProps) {
  const { accessToken } = useAuth();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: { body: string; replyToId?: number } = { body };
      if (replyToId) {
        payload.replyToId = replyToId;
      }

      await authenticatedFetch(`/social/posts/${postId}/comment`, {
        method: "POST",
        body: payload,
        token: accessToken,
      });

      toast.success(replyToId ? "Reply posted!" : "Comment posted!");
      setBody("");
      onCommentPosted();
      if (onCancel) onCancel();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to post comment.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={replyToId ? "Write your reply..." : "Add a comment..."}
        className="w-full rounded-md border-gray-500 bg-black/20 p-2 text-shako-off-white focus:border-shako-accent focus:ring-shako-accent"
        rows={2}
        required
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1 text-sm text-gray-300 hover:bg-white/10"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-shako-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
