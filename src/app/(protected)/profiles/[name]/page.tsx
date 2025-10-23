"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { Profile, PostDetail } from "@/lib/types";
import Spinner from "@/components/general/Spinner";
import ProfileHeader from "./components/ProfileHeader";
import toast from "react-hot-toast";
import Modal from "@/components/general/Modal";
import PostForm from "@/components/forms/PostForm";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import FollowList from "@/app/(protected)/profiles/[name]/components/FollowList";
import { buildUrl } from "@/lib/urlBuilder";
import ManagePostCard from "./components/ManagePostCard";

export default function ProfilePage() {
  const { name } = useParams<{ name: string }>();
  const { userProfile, accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostDetail | null>(null);

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalContent, setFollowModalContent] = useState<"followers" | "following" | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = userProfile?.name === name;


  const fetchProfileData = useCallback(async () => {
    if (!name || !accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const profileApiUrl = buildUrl(`/social/profiles/${name}`, {
        _followers: true,
        _following: true,
      });

      const profilePostApiUrl = buildUrl(`/social/profiles/${name}/posts`, {
        _author: true,
        _reactions: true,
        _comments: true,
      });

      const profilePromise = authenticatedFetch<{ data: Profile }>(profileApiUrl, { token: accessToken });

      const postsPromise = authenticatedFetch<{ data: PostDetail[] }>(profilePostApiUrl, { token: accessToken });

      const [profileResponse, postsResponse] = await Promise.all([profilePromise, postsPromise]);

      setProfile(profileResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [name, accessToken]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleEdit = (post: PostDetail) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setPostToEdit(null);
    fetchProfileData();
  };

  const openDeleteConfirmation = (post: PostDetail) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleShowFollowers = () => {
    setFollowModalContent("followers");
    setIsFollowModalOpen(true);
  };
  const handleShowFollowing = () => {
    setFollowModalContent("following");
    setIsFollowModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const apiUrl = buildUrl(`/social/posts/${postToDelete.id}`);
      await authenticatedFetch(apiUrl, { method: "DELETE", token: accessToken });
      toast.success("Post deleted.");
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
      fetchProfileData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete post.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
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
  if (!profile) {
    return <div className="p-8 text-center text-shako-off-white/80">Profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* This prop drilling is now correct because `fetchProfileData` is a stable function */}
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onProfileUpdate={fetchProfileData}
        onShowFollowers={handleShowFollowers}
        onShowFollowing={handleShowFollowing}
      />

      <section>
        <h2 className="mb-6 text-2xl font-bold text-shako-off-white">Posts by {profile.name}</h2>
        {posts && posts.length > 0 ? (
          <div className="columns-1 space-y-4 sm:columns-2 xl:columns-3">
            {posts.map((post) => (
              <ManagePostCard
                isOwner={isOwner}
                key={post.id}
                post={post}
                onEdit={() => handleEdit(post)}
                onDelete={() => openDeleteConfirmation(post)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-white/10 p-8 text-center text-gray-400">This user hasn´t posted anything yet.</p>
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {postToEdit && (
          <PostForm
            postToEdit={postToEdit}
            onCancel={() => {
              setIsModalOpen(false);
              setPostToEdit(null);
            }}
            onFormSuccess={handleFormSuccess}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ConfirmationDialog
          title={`Delete Post:`}
          secondaryTitle={`'${postToDelete?.title}'`}
          message="Are you sure you want to permanently delete this post? This action cannot be undone."
          confirmText="Yes, Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isConfirming={isDeleting}
        />
      </Modal>

      <Modal isOpen={isFollowModalOpen} onClose={() => setIsFollowModalOpen(false)}>
        {followModalContent === "followers" && (
          <FollowList title="Followers" users={profile.followers || []} onClose={() => setIsFollowModalOpen(false)} />
        )}
        {followModalContent === "following" && (
          <FollowList title="Following" users={profile.following || []} onClose={() => setIsFollowModalOpen(false)} />
        )}
      </Modal>
    </div>
  );
}
