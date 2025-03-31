import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/config';

export const useSliders = () => {
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sliders`);
        const data = await response.json();
        setSliderImages(data.data?.map((item: { image_url: string }) => item.image_url) || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sliders:", error);
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (sliderImages.length > 0 ? (prev + 1) % sliderImages.length : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return {
    sliderImages,
    currentSlide,
    setCurrentSlide,
    loading
  };
}; 