import type { Metadata } from "next";
import { IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mltex.mathlumen.com";

const TITLE = "MLTeX — Fast LaTeX in your browser";
const DESCRIPTION =
  "Privacy-first, client-side LaTeX editor with live KaTeX preview. No servers, no sign-up — your math stays on your machine.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    template: "%s | MLTeX",
  },
  description: DESCRIPTION,

  keywords: [
    "LaTeX editor",
    "online LaTeX",
    "KaTeX",
    "math editor",
    "browser LaTeX",
    "client-side LaTeX",
    "MathLumen",
    "MLTeX",
    "live LaTeX preview",
    "privacy LaTeX",
  ],

  authors: [{ name: "MathLumen", url: "https://mathlumen.com" }],
  creator: "MathLumen",
  publisher: "MathLumen",

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // OpenGraph
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MLTeX by MathLumen",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@mathlumen",
    creator: "@mathlumen",
  },

  // App metadata
  applicationName: "MLTeX",
  category: "productivity",

  // Verification placeholders — fill in once claimed
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${ibmPlexMono.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="mltex-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
