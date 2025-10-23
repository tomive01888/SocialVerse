import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Noto_Sans_JP, Zen_Kurenaido } from "next/font/google";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoginIntro from "@/components/LoginIntro";
import Footer from "@/components/ui/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

const zenKurenaido = Zen_Kurenaido({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zen-kurenaido",
});

export const metadata: Metadata = {
  title: "社交VERSE",
  description: "A social media platform built with Noroff API",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png+xml" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSansJP.variable} ${zenKurenaido.variable}`}>
      <body className={`${notoSansJP.variable}`}>
        <AuthProvider>
          <LoginIntro />
          <div className="aurora-container" />
          <div className="background-text-container pt-24">
            <div className="background-text">
              <span className="mx-4">社交VERSE 社交VERSE 社交VERSE</span>
              <span className="mx-4">社交VERSE 社交VERSE 社交VERSE</span>
            </div>
            <div className="background-text">
              <span className="mx-4">RSE 社交VERSE 社交VERSE 社交VE</span>
              <span className="mx-4">RSE 社交VERSE 社交VERSE 社交VE</span>
            </div>
            <div className="background-text">
              <span className="mx-4">社交VERSE 社交VERSE 社交VERSE</span>
              <span className="mx-4">社交VERSE 社交VERSE 社交VERSE</span>
            </div>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
          <main className="isolation-auto min-h-[80vh]">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
        </AuthProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
