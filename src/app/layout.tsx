import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://documind.example.com"),
  title: {
    default: "DocuMind | AI document intelligence platform",
    template: "%s | DocuMind",
  },
  description:
    "DocuMind helps teams upload, organize, and understand documents with AI-assisted search, summaries, and secure workflows.",
  keywords: [
    "DocuMind",
    "AI document management",
    "document intelligence",
    "PDF summarizer",
    "AI SaaS",
  ],
  openGraph: {
    title: "DocuMind | AI document intelligence platform",
    description:
      "DocuMind helps teams upload, organize, and understand documents with AI-assisted search, summaries, and secure workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind | AI document intelligence platform",
    description:
      "DocuMind helps teams upload, organize, and understand documents with AI-assisted search, summaries, and secure workflows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
