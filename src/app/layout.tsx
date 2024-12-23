"use client";

import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

// Load fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define the props type
interface RootLayoutProps {
  children: React.ReactNode; // Accepts any valid React children
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <header>
          <nav>
            <ul style={{ display: "flex", gap: "1rem", listStyleType: "none" }}>
              <li>
                <Link href="/createInfluencer">Create influencer</Link>
              </li>
              <li>
                <Link href="/listInfluencers">List Influencers</Link>
              </li>

              {/* The Logout button will be rendered within a protected layout */}
            </ul>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
