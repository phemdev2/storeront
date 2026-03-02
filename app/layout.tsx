import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "SimpleShop",
  description: "Modern eCommerce Store",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}