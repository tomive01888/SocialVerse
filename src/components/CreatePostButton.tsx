"use client";

import { useState } from "react";
import Modal from "./general/Modal";
import PostForm from "./forms/PostForm";

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
          "rounded-md bg-shako-accent px-6 py-2 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
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
