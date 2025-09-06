'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const craftingProcessImages = [
  {
    id: '1',
    src: '/images/Product banner/hand weaving 1.png',
    alt: 'Traditional hand weaving process - Setting up the loom',
    title: 'Hand Weaving',
    description: 'Traditional weaving techniques'
  },
  {
    id: '2',
    src: '/images/Product banner/hand weaving 2.png',
    alt: 'Final product with weaving intricate patterns',
    title: 'Intricate Patterns',
    description: 'Masterful pattern creation'
  },
  {
    id: '3',
    src: '/images/Product banner/hand weaving 3.png',
    alt: 'Detailed handwork in traditional tribal weaving',
    title: 'Artisan Craft',
    description: 'Skilled hands at work'
  },
  {
    id: '4',
    src: '/images/Product banner/hand weaving 4.png',
    alt: 'Artisan crafting traditional tribal textiles',
    title: 'Tribal Textiles',
    description: 'Authentic creation'
  },
  {
    id: '5',
    src: '/images/Product banner/product (16).png',
    alt: 'Traditional crafting process',
    title: 'Traditional Craft',
    description: 'Centuries-old techniques'
  },
  {
    id: '6',
    src: '/images/Product banner/product (18).png',
    alt: 'Authentic tribal product creation',
    title: 'Cultural Heritage',
    description: 'Rich tradition'
  },
  {
    id: '7',
    src: '/images/Product banner/hand weaving 7.jpg',
    alt: 'Master artisan demonstrating traditional techniques',
    title: 'Master Artisan',
    description: 'Expert craftsmanship'
  }
];

export default function ProductCollage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % craftingProcessImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 text-tribal-cream mobile-title-wrap font-serif">
          How Our Crafts Are Made
        </h2>
        
        {/* Slider */}
        <div className="slider w-full h-[70vh] relative">
          <div className="items-group w-full h-full relative">
            {craftingProcessImages.map((image, index) => (
              <div
                key={image.id}
                className={`item absolute top-0 left-0 w-full h-full flex items-center justify-center p-12 transition-all duration-500 ${
                  index === currentIndex ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                {/* Background image using Next.js Image */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
                
                {/* Background blur effect */}
                <div className="blur absolute top-0 left-0 w-full h-full z-0">
            <Image
                    src={image.src}
                    alt={image.alt}
              fill
              className="object-cover"
              style={{
                      filter: 'blur(5px)',
                      transform: 'scale(1.03)'
                    }}
                    sizes="100vw"
                  />
                </div>
                
                {/* Main content block */}
                <div className="block relative w-full max-w-md h-full max-h-96 p-5 text-white rounded-lg overflow-hidden transform scale-105 transition-all duration-500 hover:shadow-2xl">
                  {/* Background image for the block */}
                  <div className="absolute inset-0">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
                  {/* Circle light effect */}
                  <span className=" absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-500 rounded-lg"
                        style={{
                          background: 'radial-gradient(circle at 80px 40px, #fff, transparent)'
                        }} />
                  
                  {/* Text content */}
                  <div className="text relative w-full h-full flex flex-col justify-center text-center z-10">
                    <h2 className="text-6xl md:text-8xl font-bold mb-0 text-white drop-shadow-lg" style={{fontFamily: 'Oswald, sans-serif'}}>
                      {image.title}
                    </h2>
                    <p className="text-sm md:text-base mt-4 text-white drop-shadow-lg" style={{fontFamily: 'Open Sans, sans-serif'}}>
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="navigations absolute bottom-0 w-full">
            <ul className="dots h-5 py-2 text-center">
              {craftingProcessImages.map((_, index) => (
                <li
                  key={index}
                  className={`inline-block w-2.5 h-2.5 cursor-pointer transition-all duration-300 bg-white rounded-full mx-1 ${
                    index === currentIndex ? 'w-4 h-4' : ''
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-tribal-cream text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed" style={{fontFamily: 'Times New Roman, serif'}}>
            Witness the ancient artistry of Jharkhand&apos;s tribal craftspeople as they weave stories into every thread, preserving centuries-old traditions through skilled hands and passionate hearts.
          </p>
        </div>
      </div>
    </section>
  );
}
