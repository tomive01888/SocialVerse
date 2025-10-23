"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-8 bg-transparent">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 text-center md:flex-row md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <p className="font-semibold text-shako-off-white">Built with</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <Link
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Next.js
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Tailwind CSS
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="https://www.typescriptlang.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              TypeScript
            </Link>
          </div>
        </div>

        {/* Right Section: Credits */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-gray-400">Powered by</p>
            <Link
              href="https://www.noroff.no/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-shako-off-white transition-colors hover:text-white"
            >
              Noroff API
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-gray-400">Development by</p>
            <Link
              href="https://ai.google/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-shako-off-white transition-colors hover:text-white"
            >
              Gemini AI
            </Link>
          </div>
          <div className="text-center md:text-right">
            {/* Using the recommended title */}
            <p className="text-sm font-semibold text-gray-400">Lead & Architect</p>
            <Link
              href="https://github.com/tomive01888"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-shako-off-white transition-colors hover:text-white"
            >
              Tom Andre Iversen
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
