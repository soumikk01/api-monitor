import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: "API Nest — Documentation",
  description: "Complete documentation for the API Nest monitoring system",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
