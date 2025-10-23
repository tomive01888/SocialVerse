"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { PostDetail } from "@/lib/types";
import toast from "react-hot-toast";

interface PostFormProps {
  postToEdit?: PostDetail;
  onFormSuccess: (updatedPost?: PostDetail) => void;
  onCancel: () => void;
}

const PostForm = ({ postToEdit, onFormSuccess, onCancel }: PostFormProps) => {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(postToEdit);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body || "");
      setMediaUrl(postToEdit.media?.url || "");
      setMediaAlt(postToEdit.media?.alt || "");
    }
  }, [isEditMode, postToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      body,
      media: mediaUrl ? { url: mediaUrl, alt: mediaAlt } : undefined,
    };

    try {
      let result;
      if (isEditMode && postToEdit) {
        result = await authenticatedFetch<PostDetail>(`/social/posts/${postToEdit.id}`, {
          method: "PUT",
          body: payload,
          token: accessToken,
        });
        toast.success("Post updated successfully!");
      } else {
        result = await authenticatedFetch<PostDetail>("/social/posts", {
          method: "POST",
          body: payload,
          token: accessToken,
        });
        toast.success("Post created successfully!");
      }
      onFormSuccess(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-shako-dark p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold text-shako-off-white">{isEditMode ? "Edit Post" : "Create New Post"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-shako-off-white/80 ">
            Title (Required)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={280}
            required
            className="w-full input-themed placeholder:italic"
            placeholder="Name of post..."
          />
        </div>
        <div>
          <label htmlFor="body" className="mb-1 block text-sm font-medium text-shako-off-white/80 ">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={280}
            className="w-full input-themed placeholder:italic resize-none h-40"
            placeholder="Text content of post..."
          />
        </div>
        <div>
          <label htmlFor="mediaUrl" className="mb-1 block text-sm font-medium text-shako-off-white/80">
            Media URL
          </label>
          <input
            id="mediaUrl"
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full input-themed placeholder:italic"
            placeholder="Image url..."
          />
        </div>
        <div>
          <label htmlFor="mediaAlt" className="mb-1 block text-sm font-medium text-shako-off-white/80">
            Media Alt Text
          </label>
          <input
            id="mediaAlt"
            type="text"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
            className="w-full input-themed placeholder:italic"
            placeholder="Alternative text for image..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-shako-accent px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : isEditMode ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
