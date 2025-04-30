import Image from "next/image";

async function getSettings() {
  try {
    const res = await fetch('https://test.zbeauty.id.vn/api/v1/settings', {
      next: { revalidate: 3600 }
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

export default async function About() {
  const settings = await getSettings();
  const aboutSetting = settings.find((setting: any) => setting.name === 'About');

  return (
    <main className="bg-white min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Gradient banner thay vì sử dụng hình ảnh */}
        <div className="mb-10 relative h-48 md:h-64 rounded-xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg px-4 text-center">
              Giới thiệu về ZBeauty
            </h1>
          </div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
        </div>

        {/* Nội dung giới thiệu */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div 
            className="prose prose-lg md:prose-xl max-w-none prose-headings:text-pink-700 prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-pink-700 prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ 
              __html: aboutSetting?.value || 'Không tìm thấy nội dung' 
            }}
          />
        </div>
      </div>
    </main>
  );
}
