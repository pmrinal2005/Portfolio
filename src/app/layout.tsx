import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* All fonts are self-hosted (no Google Fonts request at runtime). */
const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "./fonts/Newsreader-Variable.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/Newsreader-Variable-Italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MRINAL PARIDA — CS & Data Science | AI, ML & Full-Stack",
  description:
    "Mrinal Parida — Computer Science and Data Science undergraduate specializing in AI, machine learning, deep learning, full-stack development and data analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
