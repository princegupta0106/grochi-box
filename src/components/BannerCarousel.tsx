
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
}

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Auto-advance slides
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  if (banners.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 my-4">
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-amber-100 to-orange-200 overflow-hidden rounded-lg shadow-sm">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => handleBannerClick(banner)}
            style={{ cursor: banner.link_url ? 'pointer' : 'default' }}
          >
            <div className="relative w-full h-full">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLDivElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-transparent flex items-center justify-start p-6 rounded-lg"
                style={{ display: banner.image_url ? 'flex' : 'none' }}
              >
                <div className="text-white max-w-md">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                  {banner.subtitle && (
                    <p className="text-lg opacity-90">{banner.subtitle}</p>
                  )}
                </div>
              </div>
              {/* Fallback when image fails to load */}
              <div 
                className="w-full h-full bg-gradient-to-r from-amber-100 to-orange-200 flex items-center justify-center rounded-lg"
                style={{ display: 'none' }}
              >
                <div className="text-amber-900 text-center max-w-md">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                  {banner.subtitle && (
                    <p className="text-lg opacity-90">{banner.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-amber-900/20 hover:bg-amber-900/40 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-900/20 hover:bg-amber-900/40 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerCarousel;
