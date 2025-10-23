"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import type { ApiErrorResponse, LoginSuccessResponse } from "@/lib/types";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOROFF_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorData: ApiErrorResponse = responseData;
        throw new Error(errorData.errors[0]?.message ?? "Login failed.");
      }

      const successData: LoginSuccessResponse = responseData;
      const { accessToken, ...profile } = successData.data;

      login(accessToken, profile);
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Themed Logo */}
        <div className="mb-8 flex justify-center" role="img" aria-label="SocialVerse logo">
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-start">
              <span className="font-sans text-3xl font-semibold text-shako-off-white translate-y-1" aria-hidden="true">
                社交
              </span>
              <span
                className="font-display flex w-full justify-between tracking-wider text-gray-400"
                aria-hidden="true"
              >
                <span>s</span>
                <span>o</span>
                <span>c</span>
                <span>i</span>
                <span>a</span>
                <span>l</span>
              </span>
            </div>
            <p className="font-display text-6xl font-semibold text-aurora-pink" aria-hidden="true">
              VERSE
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="login-heading" noValidate>
          <h1 id="login-heading" className="sr-only">
            Sign in to your account
          </h1>

          {error && (
            <div
              className="rounded-md border border-red-500/50 bg-red-500/20 p-3 text-sm text-white"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-shako-off-white/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-white/20 bg-black/20 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:border-shako-accent focus:ring-2 focus:ring-inset focus:ring-shako-accent"
              autoComplete="email"
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-shako-off-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-white/20 bg-black/20 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:border-shako-accent focus:ring-2 focus:ring-inset focus:ring-shako-accent"
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-md bg-shako-accent px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-shako-accent/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-shako-dark focus:ring-shako-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-shako-accent disabled:hover:shadow-sm"
              aria-busy={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don´t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-aurora-pink transition-colors hover:text-aurora-pink/80 focus:outline-none focus:ring-2 focus:ring-aurora-pink focus:ring-offset-2 focus:ring-offset-shako-dark rounded"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
