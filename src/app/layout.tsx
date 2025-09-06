import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Scode Control - Smart Home Management",
  description: "Điều khiển thiết bị thông minh Xiaomi Mijia từ một nơi duy nhất",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-cyberpunk-grid cyberpunk-font min-h-screen antialiased">
        {/* Nền grid neon cyberpunk */}
        <div className="fixed inset-0 -z-10 bg-cyberpunk-grid pointer-events-none" />
        {/* Main content */}
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
