"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/ui/Navbar"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}