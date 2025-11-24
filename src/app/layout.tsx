import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arthouse Screen Print and Design Studio",
  description: "Professional screen printing, design services, and custom apparel solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="screen-orientation" content="portrait" />
        <style>{`
          @media screen and (orientation: landscape) and (max-height: 768px) {
            body::before {
              content: "Please rotate your device to portrait mode";
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: black;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              text-align: center;
              z-index: 9999;
            }
            body > * {
              display: none;
            }
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
