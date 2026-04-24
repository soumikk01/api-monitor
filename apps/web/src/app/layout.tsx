import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code, JetBrains_Mono } from "next/font/google";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

// next/font: fonts are self-hosted and inlined — no render-blocking external requests
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "API Nest — Real-time API Monitoring",
  description: "API Nest gives engineering teams real-time visibility into every API call. Monitor uptime, latency, and errors across all your microservices with a single command.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Material Symbols — still loaded via CDN as next/font doesn't support variable icon fonts */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
