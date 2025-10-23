"use client";
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PostOptionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostOptions({ onEdit, onDelete }: PostOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
        <MoreHorizontal />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-white/10 bg-shako-dark shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
