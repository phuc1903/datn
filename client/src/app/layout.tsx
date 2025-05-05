import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from './components/header'; // Import Header
import Footer from './components/footer'; // Import Footer
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zbeauty HCMC",
  description: "Zbeauty HCMC, a beauty store in HCMC",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    other: [
      { rel: "icon", url: "/favicon.png", sizes: "32x32" },
      { rel: "icon", url: "/favicon.png", sizes: "16x16" }
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
        className={`${inter.variable} antialiased`}
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
