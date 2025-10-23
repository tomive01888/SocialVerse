"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { buildUrl } from "@/lib/urlBuilder";
import { Share2, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { PostDetail } from "@/lib/types";
import UntrustedImage from "@/components/UntrustedImage";
import Reactions from "@/app/(protected)/posts/[id]/components/Reactions";
import CommentsSection from "@/app/(protected)/posts/[id]/components/CommentSection";
import PostForm from "@/components/forms/PostForm";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Modal from "@/components/general/Modal";
import Spinner from "@/components/general/Spinner";
import toast from "react-hot-toast";
import PostOptions from "./components/PostOptions";

export default function SinglePostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, userProfile } = useAuth();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id || !accessToken) return;

    const apiUrl = buildUrl(`/social/posts/${id}`, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    try {
      const response = await authenticatedFetch<{ data: PostDetail }>(apiUrl, { token: accessToken });

      setPost(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not refresh post data.";
      setError(errorMessage);
    }
  }, [id, accessToken]);

  useEffect(() => {
    setIsLoading(true);
    fetchPost().finally(() => setIsLoading(false));
  }, [fetchPost]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchPost();
  };

  const handleConfirmDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      const apiUrl = buildUrl(`/social/posts/${post.id}`);
      await authenticatedFetch(apiUrl, { method: "DELETE", token: accessToken });
      toast.success("Post deleted successfully.");
      router.push("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete post.";

      toast.error(errorMessage);

      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title,
          text: `Check out this post on 社交VERSE!`,
          url: window.location.href,
        })
        .catch((error) => toast.error("Share failed:", error.message));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Post URL copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-shako-accent">Error: {error}</div>;
  }
  if (!post) {
    return <div className="p-8 text-center text-shako-off-white/80">Post not found.</div>;
  }
  const isOwner = userProfile?.name === post.author?.name;
  const authorName = post.author?.name ?? "Unknown Author";
  const authorAvatar = post.author?.avatar?.url ?? "https://via.placeholder.com/40";

  return (
    <>
      <div className="container mx-auto max-w-4xl p-4">
        <article className="rounded-lg border border-white/10 bg-white/10 shadow-xl backdrop-blur-sm">
          <UntrustedImage
            src={post.media?.url}
            alt={post.media?.alt || ""}
            className="w-full rounded-t-lg object-cover"
          />

          <div className="p-6 sm:p-8">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Link href={`/profiles/${authorName}`} className="group flex items-center gap-4">
                <UntrustedImage src={authorAvatar} alt={authorName} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h2 className="text-lg font-bold text-shako-off-white transition-colors group-hover:text-aurora-pink">
                    {authorName}
                  </h2>
                  <p className="text-sm text-gray-400">{new Date(post.created).toLocaleString()}</p>
                </div>
              </Link>

              {isOwner ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-white/10 p-2 text-sm font-semibold text-shako-off-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-shako-accent/80 p-2 text-sm font-semibold text-white transition-colors hover:bg-shako-accent"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-md bg-white/10 p-2 text-sm font-semibold text-shako-off-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              )}
            </header>
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{post.title}</h1>
              {post.body && <p className="text-shako-off-white/90">{post.body}</p>}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <Reactions postId={post.id} initialReactions={post.reactions || []} />
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <CommentsSection postId={post.id} comments={post.comments || []} onCommentsUpdate={fetchPost} />
            </div>
          </div>
        </article>
      </div>

      {/* Modals for Editing and Deleting */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <PostForm postToEdit={post} onCancel={() => setIsEditModalOpen(false)} onFormSuccess={handleEditSuccess} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ConfirmationDialog
          title={`Delete Post: '${post.title}'`}
          message="Are you sure you want to permanently delete this post? This action cannot be undone."
          confirmText="Yes, Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isConfirming={isDeleting}
        />
      </Modal>
    </>
  );
}
