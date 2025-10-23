"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginIntro() {
  const { isNewLogin, setIsNewLogin } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const shouldHideIntro = localStorage.getItem("hideIntroAnimation") === "true";

    if (isNewLogin && !shouldHideIntro) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsNewLogin(false);
      }, 3400);

      return () => clearTimeout(timer);
    }
  }, [isNewLogin, setIsNewLogin]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
        >
          <motion.div
            className="absolute top-0 h-1/2 w-full bg-shako-dark"
            initial={{ y: "-100%" }}
            animate={{ y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            exit={{ y: "-100%", transition: { duration: 0.5, ease: "easeInOut" } }}
          />
          <motion.div
            className="absolute bottom-0 h-1/2 w-full bg-shako-dark"
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            exit={{ y: "100%", transition: { duration: 0.5, ease: "easeInOut" } }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-2 overflow-hidden md:flex-row md:gap-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delayChildren: 0.6, staggerChildren: 0.2 }}
          >
            <motion.span
              className="font-sans text-5xl font-semibold text-shako-off-white md:text-5xl"
              variants={{
                hidden: { x: "-100%", opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
            >
              Welcome to
            </motion.span>
            <motion.div
              className="flex items-center gap-2"
              variants={{
                hidden: { x: "100%", opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
            >
              <span className="font-sans text-5xl font-semibold text-shako-off-white md:text-5xl">社交</span>
              <span className="font-display text-4xl font-semibold text-aurora-pink md:text-6xl">VERSE</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
