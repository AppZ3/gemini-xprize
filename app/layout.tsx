import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppZ Automation Advisor — AI-Powered Business Automation",
  description: "Describe your business. Gemini AI builds your custom automation blueprint and recommends the right tools to save 10+ hours per week.",
  openGraph: {
    title: "AppZ Automation Advisor",
    description: "Get your personalised business automation blueprint, powered by Gemini AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
