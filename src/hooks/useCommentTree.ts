import { useMemo } from "react";
import { Comment } from "@/lib/types";

export interface CommentNode extends Comment {
  replies: CommentNode[];
}

export function useCommentTree(comments: Comment[]): CommentNode[] {
  return useMemo(() => {
    const sortedComments = [...comments].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    const commentMap: { [key: number]: CommentNode } = {};
    const nestedComments: CommentNode[] = [];

    for (const comment of sortedComments) {
      commentMap[comment.id] = { ...comment, replies: [] };
    }

    for (const comment of sortedComments) {
      const commentNode = commentMap[comment.id];
      if (comment.replyToId) {
        const parent = commentMap[comment.replyToId];
        if (parent) {
          parent.replies.push(commentNode);
        }
      } else {
        nestedComments.push(commentNode);
      }
    }

    return nestedComments;
  }, [comments]);
}
