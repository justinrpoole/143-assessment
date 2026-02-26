import type { Metadata, Viewport } from "next";
import { Orelega_One, Inter } from "next/font/google";
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
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    siteName: "143 Leadership",
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
  viewportFit: "cover",
};

const JSON_LD_ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "143 Leadership",
  url: "https://143leadership.com",
  logo: "https://143leadership.com/icon.svg",
  description:
    "Science-backed leadership assessment measuring 9 trainable capacities. 143 means I love you — self-directed compassion meets behavioural measurement.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orelega.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORG) }}
        />
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <ServiceWorkerRegistration />
        <div className="gold-noise-overlay" aria-hidden="true" />
        <ToastProvider>
          <div id="main-content">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
