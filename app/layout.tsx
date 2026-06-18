import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free AU Business Automation Blueprint | AppZ AU Business Advisor",
  description: "Australian small business? Get a free, personalised automation blueprint from Gemini AI -- with GST, BAS, super, and Fair Work context built in. 30 seconds.",
  keywords: ["Australian small business automation", "BAS automation", "GST software", "Xero automation", "AU business AI", "n8n Australia"],
  openGraph: {
    title: "Free AI Automation Blueprint for Your Australian Business",
    description: "Gemini AI analyses your AU business with real Australian context: GST, BAS, superannuation, Fair Work. Get your personalised plan in 30 seconds.",
    type: "website",
    url: "https://gemini-xprize.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AU Business Automation Blueprint -- Powered by Gemini AI",
    description: "Gemini AI knows Australian tax, super, and compliance. Get your free automation plan in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
