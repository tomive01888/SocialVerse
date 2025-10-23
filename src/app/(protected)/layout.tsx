import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
