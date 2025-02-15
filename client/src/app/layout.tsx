import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from './components/header'; // Import Header
import Footer from './components/footer'; // Import Footer
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
  title: "Zbeauty HCMC",
  description: "Zbeauty HCMC, a beauty store in HCMc",
  icons: {
    icon: "/favicon.png", 
    apple: "/apple-touch-icon.png", // Icon cho thiết bị Apple
    other: [
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <Header />

        {/* Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
