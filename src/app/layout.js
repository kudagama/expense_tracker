import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Pocketwise – Personal Finance",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Pocketwise", statusBarStyle: "black-translucent" },
  icons: { icon: "/pwa-icon/192", apple: "/pwa-icon/180" },
  description: "Track your monthly salary, expenses, and daily spend limits",
};

export const viewport = { themeColor: '#10111b', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className}>
      <body>{children}</body>
    </html>
  );
}
