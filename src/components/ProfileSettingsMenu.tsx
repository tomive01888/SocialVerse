"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

interface ProfileSettingsMenuProps {
  onEditProfile: () => void;
  onClose: () => void;
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-shako-accent" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ProfileSettingsMenu({ onEditProfile, onClose }: ProfileSettingsMenuProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem("hideIntroAnimation") === "true";
    setShowIntro(!savedPreference);
  }, []);

  const handleToggleChange = (enabled: boolean) => {
    setShowIntro(enabled);
    localStorage.setItem("hideIntroAnimation", String(!enabled));
  };

  const handleEdit = () => {
    onClose();
    onEditProfile();
  };

  return (
    <motion.div
      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-white/10 bg-shako-dark shadow-lg"
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
          <span>Edit Profile</span>
        </button>
        <div className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-shako-off-white/80">
          <span>Show Intro</span>
          <ToggleSwitch enabled={showIntro} onChange={handleToggleChange} />
        </div>
      </div>
    </motion.div>
  );
}
