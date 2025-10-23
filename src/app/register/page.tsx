"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import type { ApiErrorResponse } from "@/lib/types";
import { motion } from "framer-motion";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOROFF_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const responseData: unknown = await response.json();

      if (!response.ok) {
        const errorData = responseData as ApiErrorResponse;
        const newErrors: FormErrors = {};
        errorData.errors.forEach((apiError) => {
          if (apiError.path && apiError.path.length > 0) {
            newErrors[apiError.path[0] as keyof FormErrors] = apiError.message;
          } else {
            newErrors.general = apiError.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the errors below.");
        return;
      }

      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-shako-off-white">Create your Account</h1>
          <p className="text-sm text-gray-400">Join the 社交VERSE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="rounded-md border border-red-500/50 bg-red-500/20 p-3 text-sm text-white">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-shako-off-white/80">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-md border-white/20 bg-black/20 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:border-shako-accent focus:ring-2 focus:ring-inset focus:ring-shako-accent ${
                errors.name ? "ring-red-500" : ""
              }`}
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

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
              className={`w-full rounded-md border-white/20 bg-black/20 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:border-shako-accent focus:ring-2 focus:ring-inset focus:ring-shako-accent ${
                errors.email ? "ring-red-500" : ""
              }`}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-shako-off-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-md border-white/20 bg-black/20 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all focus:border-shako-accent focus:ring-2 focus:ring-inset focus:ring-shako-accent ${
                errors.password ? "ring-red-500" : ""
              }`}
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-md bg-shako-accent px-4 py-2.5 font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-shako-dark focus:ring-shako-accent disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-aurora-pink transition-colors hover:text-aurora-pink/80">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
