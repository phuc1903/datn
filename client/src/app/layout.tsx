import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from './components/header'; // Import Header
import Footer from './components/footer'; // Import Footer
import "./globals.css";
import { SettingsProvider } from './context/SettingsContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

async function getSettings() {
  try {
    const res = await fetch('https://test.zbeauty.id.vn/api/v1/settings', {
      next: { revalidate: 3600 } // Revalidate mỗi giờ
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch settings');
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const nameWebsite = settings.find((setting: any) => setting.name === 'NameWebsite');
  
  return {
    title: nameWebsite?.value || "Zbeauty HCMC",
    description: "Zbeauty HCMC, a beauty store in HCMc",
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
      other: [
        { rel: "icon", url: "/favicon.png", sizes: "32x32" },
        { rel: "icon", url: "/favicon.png", sizes: "16x16" }
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
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <SettingsProvider settings={settings}>
          {/* Header */}
          <Header />

          {/* Content */}
          <main>{children}</main>

          {/* Footer */}
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
