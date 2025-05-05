import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from './components/header'; // Import Header
import Footer from './components/footer'; // Import Footer
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

async function getSettings() {
  try {
    const response = await fetch('https://quantri-zbeauty.tranhuuhiep2004.id.vn/api/v1/settings', { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error('Lỗi khi tải dữ liệu');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ API:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const nameWebsite = settings.find((item: any) => item.name === "NameWebsite")?.value || "ZBeauty - Sản phẩm làm đẹp";
  const iconSite = settings.find((item: any) => item.name === "IconSite")?.value || "/favicon.png";
  
  return {
    title: nameWebsite,
    description: "ZBeauty - Thiên đường mỹ phẩm chính hãng TPHCM",
    icons: {
      icon: iconSite,
      apple: iconSite,
      other: [
        { rel: "icon", url: iconSite, sizes: "32x32" },
        { rel: "icon", url: iconSite, sizes: "16x16" }
      ]
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} antialiased`}
      >
        {/* Header */}
        <Header settings={settings} />

        {/* Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer settings={settings} />
      </body>
    </html>
  );
}
