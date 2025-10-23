"use client";
import Link from "next/link";
import UntrustedImage from "../../../../../components/UntrustedImage";
import { FollowUser } from "@/lib/types";

interface FollowListProps {
  title: "Followers" | "Following";
  users: FollowUser[];
  onClose: () => void;
}

export default function FollowList({ title, users, onClose }: FollowListProps) {
  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <h2 className="mb-4 text-2xl font-bold text-shako-off-white">{title}</h2>
        <p>No users to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-white/10 bg-shako-dark shadow-xl">
      <h2 className="border-b border-white/10 p-4 text-xl font-bold text-shako-off-white">{title}</h2>
      <ul className="max-h-[70vh] flex-1 overflow-y-auto">
        {users.map((user) => (
          <li key={user.name}>
            <Link
              href={`/profiles/${user.name}`}
              onClick={onClose}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-white/10"
            >
              <UntrustedImage
                src={user.avatar?.url ?? "https://via.placeholder.com/150"}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="font-semibold text-shako-off-white">{user.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
