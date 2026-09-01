import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3077");

const description =
  "MyFulus bantu kamu catat pemasukan dan pengeluaran, lihat ringkasan bulanan, dan pilah pengeluaran per kategori. Bisa di-install kayak app.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "MyFulus",
  title: {
    default: "MyFulus — Catat keuangan pribadi",
    template: "%s · MyFulus",
  },
  description,
  keywords: [
    "catat keuangan",
    "pencatat pengeluaran",
    "personal finance",
    "budgeting",
    "keuangan pribadi",
    "money tracker",
  ],
  authors: [{ name: "Fariz Rahman" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyFulus",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "MyFulus",
    title: "MyFulus — Catat keuangan pribadi",
    description,
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "MyFulus" }],
  },
  twitter: {
    card: "summary",
    title: "MyFulus — Catat keuangan pribadi",
    description,
    images: ["/icon-512.png"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#c4562b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
