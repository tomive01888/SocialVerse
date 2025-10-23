import Header from "@/components/ui/Header";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
