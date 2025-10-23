"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  title: string;
  secondaryTitle?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
}

export default function ConfirmationDialog({
  title,
  secondaryTitle,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isConfirming,
}: ConfirmationDialogProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-shako-dark p-6 shadow-xl text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-shako-accent/20">
        <AlertTriangle className="h-6 w-6 text-shako-accent" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-shako-off-white">{title}</h2>
      <h3 className="mt-4 text-xl font-bold text-shako-off-white">{secondaryTitle}</h3>
      <p className="mt-2 text-gray-300">{message}</p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white/10 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className="rounded-md bg-shako-accent px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isConfirming ? "Deleting..." : confirmText}
        </button>
      </div>
    </div>
  );
}
