"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/include/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      <body className={inter.className}>
        <Navbar/>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
