import Image from 'next/image';
import { useSliders } from '@/hooks/useSliders';

const HeroSlider = () => {
  const { sliderImages, currentSlide, setCurrentSlide, loading } = useSliders();

  if (loading) return <div className="h-[400px] bg-gray-200 animate-pulse" />;

  return (
    <section className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image 
                src={image} 
                alt={`Slide ${index + 1}`} 
                fill 
                className="object-cover" 
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider; 