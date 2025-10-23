"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserCircle2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <header className="top-0 z-50 bg-white/10 shadow-sm backdrop-blur-md sticky">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-start">
              <span className="font-sans text-3xl font-semibold text-shako-off-white sm:text-4xl">社交</span>
              <span className="font-display flex w-full justify-between tracking-wider text-gray-400">
                <span>s</span>
                <span>o</span>
                <span>c</span>
                <span>i</span>
                <span>a</span>
                <span>l</span>
              </span>
            </div>
            <p className="font-display text-5xl font-semibold text-aurora-pink sm:text-6xl -translate-y-1">VERSE</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {userProfile && (
            <Link
              href={`/profiles/${userProfile.name}`}
              className="group w-48 flex items-center justify-end gap-2 text-sm font-medium text-aurora-pink transition-colors hover:text-purple-400"
            >
              <UserCircle2 size={20} className="transition-transform group-hover:scale-110" />
              <span>Welcome, {userProfile.name}</span>
            </Link>
          )}
          {userProfile && (
            <button
              onClick={logout}
              className="rounded-md bg-shako-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute left-0 w-full border-t border-white/10 bg-shako-dark/90 p-4 shadow-lg backdrop-blur-md sm:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col items-center gap-6">
              {userProfile && (
                <Link
                  href={`/profiles/${userProfile.name}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg py-3 text-lg font-medium text-aurora-pink transition-colors hover:bg-white/10"
                >
                  <UserCircle2 size={24} />
                  <span>{userProfile.name}</span>
                </Link>
              )}
              {userProfile && (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-shako-accent py-3 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
