import type { Metadata, Viewport } from "next";
import { Orelega_One, Inter } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ToastProvider } from "@/components/ui/Toast";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const orelega = Orelega_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cosmic-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://143leadership.com"),
  title: {
    default: "143 Leadership — Measure, Train, and Sustain Your Leadership Light",
    template: "%s — 143 Leadership",
  },
  description: "143 means I love you. The 143 Leadership Assessment maps your nine leadership capacities through self-directed compassion and science-backed daily practice. Free beta — take the assessment today.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "143 OS",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "143 Leadership",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "143 Leadership — Measure, Train, and Sustain Your Leadership Light" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#60058D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orelega.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <ServiceWorkerRegistration />
        <ToastProvider>
          <MarketingNav />
          <div id="main-content">
            {children}
          </div>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
