import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: {
    default: "DJN Store",
    template: "%s — DJN Store",
  },
  description: "ARPG virtual goods storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className="dark" suppressHydrationWarning>
        <head>
          {/* Stitch export uses Material Symbols; not covered by next/font */}
          {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols stylesheet */}
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${spaceGrotesk.variable} flex min-h-screen flex-col bg-background font-body text-on-background antialiased selection:bg-surface-variant selection:text-on-surface`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
