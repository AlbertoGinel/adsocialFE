"use client";

import "./globals.css";
import Link from "next/link";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">
        {false && (
          <header>
            <nav>
              <ul
                style={{ display: "flex", gap: "1rem", listStyleType: "none" }}
              >
                <li>
                  <Link href="/createInfluencer">Create influencer</Link>
                </li>
                <li>
                  <Link href="/listInfluencers">List Influencers</Link>
                </li>
              </ul>
            </nav>
          </header>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}
