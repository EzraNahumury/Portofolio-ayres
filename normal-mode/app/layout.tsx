import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayres",
  description:
    "AYRES is an Indonesian sportswear brand from Yogyakarta — every sale powered by web apps we built ourselves: AI marketing agents, an online shop, a 24/7 chatbot and a production CRM.",
  metadataBase: new URL("https://ayresapparel.com"),
  openGraph: {
    title: "Ayres",
    description:
      "Indonesian sportswear, sold and scaled by web apps we built ourselves.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden bg-bg text-fg">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-noise opacity-[0.05] mix-blend-overlay"
        />
        <LangProvider>
          <LenisProvider>
            <div className="relative z-10">{children}</div>
          </LenisProvider>
        </LangProvider>
      </body>
    </html>
  );
}
