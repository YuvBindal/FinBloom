"use client";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "./utils/auth-helper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, className }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className={`w-full h-full max-w-1100 inline-block bg-dark py-0 px-64 pt-0
          ${className}`}
        >
          <AuthContextProvider>
            <Navbar />
            {children}
          </AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
