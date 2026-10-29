import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#080a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "KAIJU STREAM — CinéWheel Streaming PWA",
  description: "Plateforme PWA de streaming et téléchargement de films, séries, animes et isekai en Afrique centrale (Cameroun). 100 FCFA/h, plafond 1000 FCFA.",
  keywords: ["streaming", "anime", "isekai", "films", "séries", "cameroun", "sebpay", "mobile money"],
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-full antialiased bg-[#080a0f] text-[#f0f0f0]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
