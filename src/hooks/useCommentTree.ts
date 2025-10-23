import { useMemo } from "react";
import { Comment } from "@/lib/types";

export interface EnrichedComment extends Comment {
  replyingToName: string | null;
}

export interface CommentNode {
  comment: EnrichedComment;
  replies: EnrichedComment[];
}

export function useCommentTree(comments: Comment[]): CommentNode[] {
  return useMemo(() => {
    if (!comments || comments.length === 0) {
      return [];
    }

    const commentMap = new Map<number, Comment>(comments.map(c => [c.id, c]));

    const mainComments = comments
      .filter(c => !c.replyToId)
      .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
      
    return mainComments.map(mainComment => {
      const allReplies: EnrichedComment[] = [];
      const repliesToFind = [mainComment.id]; 

      comments.forEach(potentialReply => {
        if(potentialReply.replyToId && comments.some(c => c.id === potentialReply.replyToId)) {
          const findParent = (id: number): boolean => {
            if (id === mainComment.id) return true;
            const parent = commentMap.get(id);
            return parent?.replyToId ? findParent(parent.replyToId) : false;
          }
          if(findParent(potentialReply.replyToId)) {
            allReplies.push(potentialReply as EnrichedComment);
          }
        }
      });
      
      const enrichedAndSortedReplies = allReplies
        .map(reply => {
          const parent = commentMap.get(reply.replyToId!);
          return { ...reply, replyingToName: parent?.author?.name || null };
        })
        .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

      return {
        comment: { ...mainComment, replyingToName: null },
        replies: enrichedAndSortedReplies,
      };
    });

  }, [comments]);
}