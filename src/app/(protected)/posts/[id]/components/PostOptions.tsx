"use client";
import { Edit, Trash2 } from "lucide-react";

interface PostOptionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostOptions({ onEdit, onDelete }: PostOptionsProps) {
  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="p-1">
      <button
        onClick={handleEdit}
        className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-shako-off-white/80 hover:bg-white/10 hover:text-white"
      >
        <Edit size={16} />
        <span>Edit Post</span>
      </button>
      <button
        onClick={handleDelete}
        className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-shako-accent hover:bg-shako-accent hover:text-white"
      >
        <Trash2 size={16} />
        <span>Delete Post</span>
      </button>
    </div>
  );
}
