"use client";

import { useState } from "react";
import Modal from "./Modal";
import PostForm from "./PostForm";

interface CreatePostButtonProps {
  onPostCreated: () => void;
  className?: string;
}

export default function CreatePostButton({ onPostCreated, className }: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    onPostCreated();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={
          className ||
          "w-full rounded-md bg-shako-accent py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-102 cursor-pointer"
        }
      >
        Create New Post
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PostForm onCancel={() => setIsModalOpen(false)} onFormSuccess={handleFormSuccess} />
      </Modal>
    </>
  );
}
