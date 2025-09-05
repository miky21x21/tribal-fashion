"use client";

import Image from "next/image";
import KinirLogo from "./KinirLogo-D";
import KinirLogoSquare from "./KinirLogo-Square";

export default function SuperHero() {
  // Product images for the slide animations (9 total)
  const productImages = [
    '/images/products/product (1).jpeg',
    '/images/products/product (2).jpeg',
    '/images/products/product (3).jpeg',
    '/images/products/product (4).jpeg',
    '/images/products/product (5).jpeg',
    '/images/products/product (6).jpeg',
    '/images/products/product (7).jpeg',
    '/images/products/product (8).jpeg',
    '/images/products/product (9).jpeg'
  ];

  const slideAnimations = [
    'animate-slide-to-1',
    'animate-slide-to-2', 
    'animate-slide-to-3',
    'animate-slide-to-4',
    'animate-slide-to-5',
    'animate-slide-to-6',
    'animate-slide-to-7',
    'animate-slide-to-8',
    'animate-slide-to-9'
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-center px-4 py-16 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/yo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Slide Animation Grid with Images */}
        <div className="grid grid-cols-3 gap-8 p-4 max-w-4xl mx-auto">
          {productImages.map((image, index) => {
            // Replace the 5th slide (index 4) with the logo
            if (index === 4) {
              return (
                <KinirLogoSquare
                  key={index}
                  size="xl"
                  color="black"
                  showSubtitle={true}
                  className={`w-48 h-48 ${slideAnimations[index]}`}
                  style={{ 
                    paddingTop: '0.5%',
                    width: '192px',
                    height: '192px'
                  }}
                  subtitleStyle={{ fontSize: '0.7rem' }}
                />
              );
            }
            
            return (
              <div 
                key={index}
                className={`w-48 h-48 flex items-center justify-center border border-white/30 bg-white/20 backdrop-blur-md shadow-md rounded-lg overflow-hidden ${slideAnimations[index]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-white/50 hover:bg-white/30`}
                style={{
                  background: `
                    linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
                    linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.05) 75%)
                  `,
                  backgroundSize: '20px 20px, 20px 20px',
                  backgroundPosition: '0 0, 0 10px'
                }}
              >
                <Image
                  src={image}
                  alt={`Tribal Product ${index + 1}`}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
