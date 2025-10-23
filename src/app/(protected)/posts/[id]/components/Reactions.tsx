"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";
import { Reaction } from "@/lib/types";
import toast from "react-hot-toast";
import { buildUrl } from "@/lib/urlBuilder";

const EMOJI_OPTIONS = ["👍", "❤️", "🥰", "😂", "😮", "😢", "😠", "🔥", "😱", "🤔", "💯", "💩", "💀"];

interface ReactionsProps {
  postId: string;
  initialReactions: Reaction[];
}

export default function Reactions({ postId, initialReactions }: ReactionsProps) {
  const { accessToken, userProfile } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [isReacting, setIsReacting] = useState<string | null>(null);

  const handleReact = async (symbol: string) => {
    if (!accessToken || !userProfile) {
      toast.error("You must be logged in to react.");
      return;
    }
    setIsReacting(symbol);

    const originalReactions = reactions;

    const existingReaction = reactions.find((r) => r.symbol === symbol);
    const userHasReacted = existingReaction?.reactors.includes(userProfile.name);

    let nextReactions: Reaction[];

    if (userHasReacted) {
      nextReactions = reactions
        .map((reaction) => {
          if (reaction.symbol === symbol) {
            return {
              ...reaction,
              count: reaction.count - 1,
              reactors: reaction.reactors.filter((name) => name !== userProfile.name),
            };
          }
          return reaction;
        })
        .filter((reaction) => reaction.count > 0);
    } else {
      if (existingReaction) {
        nextReactions = reactions.map((reaction) => {
          if (reaction.symbol === symbol) {
            return {
              ...reaction,
              count: reaction.count + 1,
              reactors: [...reaction.reactors, userProfile.name],
            };
          }
          return reaction;
        });
      } else {
        const newReaction = { symbol, count: 1, reactors: [userProfile.name] };
        nextReactions = [...reactions, newReaction];
      }
    }

    setReactions(nextReactions);

    try {
      const apiUrl = buildUrl(`/social/posts/${postId}/react/${symbol}`);

      await authenticatedFetch(apiUrl, {
        method: "PUT",
        token: accessToken,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update reaction.";
      toast.error(errorMessage);
      setReactions(originalReactions);
    } finally {
      setIsReacting(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-shako-off-white">Reactions</h3>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {reactions.map(({ symbol, count, reactors }) => {
          const userHasReacted = userProfile && reactors.includes(userProfile.name);
          return (
            <button
              key={symbol}
              onClick={() => handleReact(symbol)}
              disabled={!!isReacting}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-all
                ${
                  userHasReacted
                    ? "border-aurora-pink bg-aurora-pink/20 text-white"
                    : "border-white/20 bg-black/20 text-gray-300 hover:border-aurora-pink"
                }
                ${isReacting === symbol ? "animate-pulse" : ""}
              `}
            >
              <span>{symbol}</span>
              <span className="font-semibold">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          {EMOJI_OPTIONS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleReact(symbol)}
              disabled={!!isReacting}
              className="rounded-full p-2 text-2xl transition-transform hover:scale-125 disabled:cursor-not-allowed"
              aria-label={`React with ${symbol}`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
