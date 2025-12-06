// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = "NovaCRM AI";
const siteUrl = "https://nova-crm-ai.vercel.app"; // cuando lo sepas, actualízalo
const siteDescription =
  "NovaCRM AI es un CRM moderno conectado a PostgreSQL y Prisma, con paneles analíticos y flujos inteligentes para tus clientes.";

// Metadatos SEO + OpenGraph + Twitter
export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  metadataBase: new URL(siteUrl),
  keywords: [
    "CRM",
    "NovaCRM AI",
    "dashboard",
    "Next.js",
    "PostgreSQL",
    "Prisma",
    "Karl Camaro",
  ],
  authors: [{ name: "Karl H. Camaro Porta", url: siteUrl }],
  creator: "Karl H. Camaro Porta",
  generator: "Next.js 14 + TypeScript",
  category: "business",

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    siteName,
    description: siteDescription,
    locale: "es_ES",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Logo de NovaCRM AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/android-chrome-512x512.png"],
    creator: "@karlcamarodev", // cuando tengas el handle, cámbialo
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    "theme-color": "#020617",
  },
};

// Configuración de viewport / theme-color para móviles
export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
