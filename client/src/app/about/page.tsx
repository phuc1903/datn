import Image from "next/image";

async function getAboutContent() {
  try {
    const response = await fetch('https://quantri-zbeauty.tranhuuhiep2004.id.vn/api/v1/settings', { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error('Lỗi khi tải dữ liệu');
    }
    const data = await response.json();
    const aboutData = data.data.find((item: any) => item.name === "About");
    return aboutData?.value || '';
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu About từ API:', error);
    return '';
  }
}

export default async function About() {
  const aboutContent = await getAboutContent();

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
              __html: aboutContent
            }}
          />
        </div>
      </div>
    </main>
  );
}
