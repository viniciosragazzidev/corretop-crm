import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const amilFont = localFont({
  src: "../public/fonts/Amil Typeface Bold.ttf",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Venacor Saúde",
  description: "Redesign Venacor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${amilFont.variable} ${plusJakartaSans.className}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
