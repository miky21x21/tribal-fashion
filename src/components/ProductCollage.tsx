'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface CollageItem {
  id: string;
  type: 'image';
  src: string;
  alt?: string;
}

const craftingProcessImages: CollageItem[] = [
  {
    id: '1',
    type: 'image',
    src: '/images/Product banner/hand weaving 1.png',
    alt: 'Traditional hand weaving process - Setting up the loom'
  },
  {
    id: '2',
    type: 'image',
    src: '/images/Product banner/hand weaving 2.png',
    alt: 'Final product with weaving intricate patterns'
  },
  {
    id: '3',
    type: 'image',
    src: '/images/Product banner/hand weaving 3.png',
    alt: 'Detailed handwork in traditional tribal weaving'
  },
  {
    id: '4',
    type: 'image',
    src: '/images/Product banner/hand weaving 4.png',
    alt: 'Artisan crafting traditional tribal textiles'
  },
  {
    id: '5',
    type: 'image',
    src: '/images/Product banner/product (16).png',
    alt: 'Traditional tribal crafting process'
  },
  {
    id: '6',
    type: 'image',
    src: '/images/Product banner/product (18).png',
    alt: 'Authentic tribal product creation'
  },
  {
    id: '7',
    type: 'image',
    src: '/images/Product banner/hand weaving 7.jpg',
    alt: 'Master artisan demonstrating traditional techniques'
  }
];

export default function ProductCollage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const zoomIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentImage = craftingProcessImages[currentImageIndex];

  const startZoomEffect = () => {
    setIsZooming(true);
    setZoomLevel(1);
    
    // Gradual zoom effect over 6 seconds for longer image display
    let currentZoom = 1;
    const zoomStep = 0.004; // Smaller increment for slower zoom
    
    zoomIntervalRef.current = setInterval(() => {
      currentZoom += zoomStep;
      setZoomLevel(currentZoom);
      
      // When zoom reaches maximum, transition to next image
      if (currentZoom >= 1.25) {
        clearInterval(zoomIntervalRef.current!);
        transitionToNextImage();
      }
    }, 20); // Update every 20ms for smooth animation
  };

  const transitionToNextImage = () => {
    setIsTransitioning(true);
    
    // Smooth slide transition
    setTimeout(() => {
      setCurrentImageIndex(prev => 
        prev === craftingProcessImages.length - 1 ? 0 : prev + 1
      );
      
      // Reset states after image change
      setTimeout(() => {
        setIsZooming(false);
        setIsTransitioning(false);
        setZoomLevel(1);
      }, 500);
    }, 1000);
  };

  const nextImage = () => {
    startZoomEffect();
  };

  useEffect(() => {
    // Start zoom effect immediately when component mounts
    startZoomEffect();

    // Auto advance every 8 seconds (6s zoom + 2s transition time)
    const setupTimer = () => {
      timerRef.current = setTimeout(() => {
        nextImage();
        setupTimer();
      }, 8000); // 8 seconds total cycle for longer image display
    };

    // Start the timer after initial zoom completes
    const startTimer = setTimeout(() => {
      setupTimer();
    }, 8000);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 text-tribal-cream mobile-title-wrap font-serif">
          How Our Crafts Are Made
        </h2>
        
        {/* Single Image Display with Zoom-In and Carousel Effect */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl bg-gray-800">
                     <div className={`w-full h-full transition-all duration-1000 ease-in-out ${
             isTransitioning ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
           }`}>
            <Image
              src={currentImage.src}
              alt={currentImage.alt || 'Traditional craft making process'}
              fill
              className="object-cover"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.02s linear' // Smooth zoom animation
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={currentImageIndex === 0}
            />
          </div>
          
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          
                    {/* Image Description Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm md:text-base bg-black/20 px-4 py-3 rounded-lg backdrop-blur-sm font-light" style={{fontFamily: 'Bahnschrift Light Condensed, sans-serif'}}>
              {currentImage.alt}
            </p>
          </div>
        </div>

        
        <div className="text-center mt-12">
          <p className="text-tribal-cream text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed" style={{fontFamily: 'Times New Roman, serif'}}>
            Witness the ancient artistry of Jharkhand&apos;s tribal craftspeople as they weave stories into every thread, preserving centuries-old traditions through skilled hands and passionate hearts.
          </p>
          <a
            href="/shop"
            className="px-8 py-4 bg-tribal-red text-tribal-cream rounded-full shadow-lg hover:bg-tribal-green transition duration-300 font-bold text-lg inline-block transform hover:scale-105"
          >
            Explore Collection
          </a>
        </div>
      </div>
      
      
    </section>
  );
}
