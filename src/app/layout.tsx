import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Live Training — TikTok + AI Affiliate Marketing",
  description:
    "Learn how to use TikTok + AI to generate $5K–$10K/month in affiliate income — even with zero followers, no tech skills, and without showing your face.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
