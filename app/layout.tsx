import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Cooking mit Müllers",
  description: "Tägliche vegetarische Rezeptvorschläge für die Familie Müller",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cooking Müllers",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-lg mx-auto min-h-screen">
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
