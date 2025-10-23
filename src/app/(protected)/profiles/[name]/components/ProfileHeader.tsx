"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PostDetail, Profile } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import UntrustedImage from "@/components/UntrustedImage";
import Modal from "@/components/general/Modal";
import ProfileForm from "./ProfileForm";
import CreatePostButton from "@/components/CreatePostButton";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  profile: Profile;
  onProfileUpdate: () => void;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

function FollowButton({ name, followers }: { name: string; followers: Profile["followers"] }) {
  const { accessToken, userProfile } = useAuth();
  const isFollowing = followers?.some((follower) => follower.name === userProfile?.name) ?? false;

  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    const endpoint = `/social/profiles/${name}/${optimisticIsFollowing ? "unfollow" : "follow"}`;
    const previousFollowingState = optimisticIsFollowing;
    setOptimisticIsFollowing(!optimisticIsFollowing);

    try {
      await authenticatedFetch(endpoint, { method: "PUT", token: accessToken });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred. Please try again.";
      toast.error(errorMessage);
      setOptimisticIsFollowing(previousFollowingState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`rounded-lg px-6 py-2 font-semibold text-white transition-colors disabled:opacity-50 ${
        optimisticIsFollowing ? "bg-shako-dark hover:bg-shako-indigo" : "bg-shako-accent hover:opacity-90"
      }`}
    >
      {isLoading ? "..." : optimisticIsFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default function ProfileHeader({
  profile,
  onProfileUpdate,
  onShowFollowers,
  onShowFollowing,
}: ProfileHeaderProps) {
  const { userProfile } = useAuth();
  const router = useRouter();
  const isMyProfile = userProfile?.name === profile.name;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const bannerUrl = profile.banner?.url ?? "https://via.placeholder.com/1500x300";
  const avatarUrl = profile.avatar?.url ?? "https://via.placeholder.com/150";

  const handleFormSuccess = () => {
    setIsEditModalOpen(false);
    onProfileUpdate();
  };

  const handlePostCreated = (newPost?: PostDetail) => {
    if (newPost) {
      toast.success("Post created! Navigating...");
      router.push(`/posts/${newPost.id}`);
    }
    onProfileUpdate();
  };

  const ActionButton = () => (
    <div className="relative">
      {isMyProfile ? (
        <>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full rounded-lg bg-white/20 p-2 font-semibold text-white transition-colors hover:bg-white/30 sm:w-auto"
            aria-haspopup="true"
            aria-expanded={isSettingsOpen}
          >
            <Settings />
          </button>
          <AnimatePresence>
            {isSettingsOpen && (
              <ProfileSettingsMenu
                onEditProfile={() => setIsEditModalOpen(true)}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <FollowButton name={profile.name} followers={profile.followers} />
      )}
    </div>
  );

  return (
    <>
      <header className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-shako-dark shadow-xl">
        <div className="h-48 w-full bg-black/20 lg:h-64">
          <UntrustedImage
            src={bannerUrl}
            alt={profile.banner?.alt || `${profile.name}'s banner`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-4 lg:p-6 relative">
          <div className="flex items-end justify-between">
            <div className="-mt-20 flex items-end gap-4">
              <UntrustedImage
                src={avatarUrl}
                alt={profile.avatar?.alt || `${profile.name}'s avatar`}
                className="h-24 w-24 rounded-full border-4 border-shako-dark bg-shako-dark object-cover lg:h-32 lg:w-32"
              />
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-shako-off-white lg:text-4xl">{profile.name}</h1>
                <p className="text-sm text-gray-400">{profile.email}</p>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <ActionButton />
            </div>
          </div>
          <div className="mt-4 lg:hidden">
            <h1 className="text-2xl font-bold text-shako-off-white">{profile.name}</h1>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
          <div className="mt-6">
            {profile.bio && <p className="mb-6 max-w-2xl text-shako-off-white/90">{profile.bio}</p>}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile._count?.posts}</p>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <button onClick={onShowFollowers} className="text-center">
                <p className="text-xl font-bold text-white">{profile._count?.followers}</p>
                <p className="text-sm text-gray-400 transition-colors hover:text-white">Followers</p>
              </button>
              <button onClick={onShowFollowing} className="text-center">
                <p className="text-xl font-bold text-white">{profile._count?.following}</p>
                <p className="text-sm text-gray-400 transition-colors hover:text-white">Following</p>
              </button>
            </div>
          </div>
          <div className="float-end mb-6">
            <CreatePostButton onPostCreated={handlePostCreated} />
          </div>
        </div>
      </header>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ProfileForm
          profileToEdit={profile}
          onCancel={() => setIsEditModalOpen(false)}
          onFormSuccess={handleFormSuccess}
        />
      </Modal>
    </>
  );
}
