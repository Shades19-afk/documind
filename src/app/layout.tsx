import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Lora } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://documind.example.com"),
  title: {
    default: "DocuMind | Read less, know more",
    template: "%s | DocuMind",
  },
  description:
    "DocuMind turns the PDFs piling up in your downloads folder into summaries, notes, and flashcards you'll actually use.",
  keywords: [
    "DocuMind",
    "document summarizer",
    "PDF summarizer",
    "study notes",
    "flashcards",
  ],
  openGraph: {
    title: "DocuMind | Read less, know more",
    description:
      "DocuMind turns the PDFs piling up in your downloads folder into summaries, notes, and flashcards you'll actually use.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind | Read less, know more",
    description:
      "DocuMind turns the PDFs piling up in your downloads folder into summaries, notes, and flashcards you'll actually use.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${lora.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}