"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { Profile } from "@/lib/types";
import toast from "react-hot-toast";

interface ProfileFormProps {
  profileToEdit: Profile;
  onFormSuccess: () => void;
  onCancel: () => void;
}

export default function ProfileForm({ profileToEdit, onFormSuccess, onCancel }: ProfileFormProps) {
  const { accessToken } = useAuth();
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profileToEdit) {
      setBio(profileToEdit.bio || "");
      setAvatarUrl(profileToEdit.avatar?.url || "");
      setBannerUrl(profileToEdit.banner?.url || "");
    }
  }, [profileToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: { bio?: string; avatar?: { url: string; alt: string }; banner?: { url: string; alt: string } } = {};

    payload.bio = bio;
    if (avatarUrl) {
      payload.avatar = { url: avatarUrl, alt: `${profileToEdit.name}'s avatar` };
    }
    if (bannerUrl) {
      payload.banner = { url: bannerUrl, alt: `${profileToEdit.name}'s banner` };
    }

    try {
      await authenticatedFetch(`/social/profiles/${profileToEdit.name}`, {
        method: "PUT",
        body: payload,
        token: accessToken,
      });
      toast.success("Profile updated successfully!");
      onFormSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-shako-dark p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold text-shako-off-white">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium text-shako-off-white/80">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onFocus={(e) => e.target.select()}
            rows={3}
            className="input-themed w-full"
            placeholder="Tell everyone a little about yourself..."
          />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="mb-1 block text-sm font-medium text-shako-off-white/80">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="input-themed w-full"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <div>
          <label htmlFor="bannerUrl" className="mb-1 block text-sm font-medium text-shako-off-white/80">
            Banner URL
          </label>
          <input
            id="bannerUrl"
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="input-themed w-full"
            placeholder="https://example.com/banner.jpg"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
