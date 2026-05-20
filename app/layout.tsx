import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Cart from "@/components/order/Cart";

export const metadata: Metadata = {
  title: "Ember & Ash — Fire-crafted Flavours",
  description:
    "Experience the art of fire-crafted Nigerian cuisine. Order online, book a table, or get it delivered.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grain">
        <Navbar />
        <Cart />
        <main>{children}</main>
        <Toaster
          position="top-center"
          containerStyle={{ top: 80, zIndex: 9999 }}
          toastOptions={{
            style: {
              background: "#2A221C",
              color: "#F5EDD8",
              border: "1px solid #3D3028",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#E8541A", secondary: "#F5EDD8" },
            },
          }}
        />
      </body>
    </html>
  );
}
