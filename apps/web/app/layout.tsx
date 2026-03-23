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

export const metadata: Metadata = {
  title: "MLTeX — Fast LaTeX in your browser",
  description:
    "A privacy-first, client-side LaTeX editor with live KaTeX preview. No servers, no sign-up — your math stays on your machine.",
  keywords: ["LaTeX", "math", "editor", "KaTeX", "MathLumen"],
  authors: [{ name: "MathLumen" }],
  openGraph: {
    title: "MLTeX — Fast LaTeX in your browser",
    description: "Privacy-first client-side LaTeX editor with live preview",
    type: "website",
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
