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

  // Additional slide animations for the side columns
  const leftColumnAnimations = [
    'animate-slide-to-10',
    'animate-slide-to-11', 
    'animate-slide-to-12'
  ];

  const rightColumnAnimations = [
    'animate-slide-to-13',
    'animate-slide-to-14',
    'animate-slide-to-15'
  ];

  return (
    <section 
      className="relative flex md:min-h-screen items-center justify-center text-center px-4 pt-4 pb-8 md:pb-24 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/superherobg.jpg")',
        backgroundSize: '100% auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat-y',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-8" style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
          {/* Left Photo Column */}
          <div className="flex flex-col gap-8 w-48">
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${leftColumnAnimations[0]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (10).jpeg"
                alt="Tribal Product 10"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${leftColumnAnimations[1]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (11).jpeg"
                alt="Tribal Product 11"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${leftColumnAnimations[2]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (12).jpeg"
                alt="Tribal Product 12"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </div>

          {/* Center Grid */}
          <div className="grid grid-cols-3 gap-8 p-4 max-w-4xl">
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
                className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${slideAnimations[index]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
                style={{
                  background: `
                    linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                    linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                  `,
                  backgroundSize: '100% 100%, 100% 4px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundRepeat: 'no-repeat, repeat-y',
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.3), 
                    0 8px 16px rgba(0,0,0,0.4),
                    0 4px 8px rgba(0,0,0,0.2),
                    inset 0 2px 4px rgba(255,255,255,0.1),
                    inset 0 -2px 4px rgba(0,0,0,0.2)
                  `,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
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

          {/* Right Photo Column */}
          <div className="flex flex-col gap-8 w-48">
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${rightColumnAnimations[0]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (13).jpeg"
                alt="Tribal Product 13"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${rightColumnAnimations[1]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (14).jpeg"
                alt="Tribal Product 14"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div 
              className={`w-48 h-48 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${rightColumnAnimations[2]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
              style={{
                background: `
                  linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                  linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                `,
                backgroundSize: '100% 100%, 100% 4px',
                backgroundPosition: '0 0, 0 0',
                backgroundRepeat: 'no-repeat, repeat-y',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3), 
                  0 8px 16px rgba(0,0,0,0.4),
                  0 4px 8px rgba(0,0,0,0.2),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.2)
                `,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Image
                src="/images/products/product (15).jpeg"
                alt="Tribal Product 15"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Only 9 slides (3x3 grid) */}
        <div className="md:hidden flex items-center justify-center px-4">
          {/* Center Grid - Only 9 slides */}
          <div className="grid grid-cols-3 gap-3 p-4 max-w-sm">
          {productImages.map((image, index) => {
            // Replace the 5th slide (index 4) with the logo
            if (index === 4) {
              return (
                <KinirLogoSquare
                  key={index}
                  size="sm"
                  color="black"
                  showSubtitle={true}
                  className={`w-24 h-24 ${slideAnimations[index]}`}
                  style={{ 
                    paddingTop: '0.5%',
                    width: '96px',
                    height: '96px'
                  }}
                  subtitleStyle={{ fontSize: '0.6rem' }}
                />
              );
            }
            
            return (
              <div 
                key={index}
                className={`w-24 h-24 flex items-center justify-center border-2 border-amber-800/60 shadow-lg rounded-lg overflow-hidden ${slideAnimations[index]} transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-amber-700/80 hover:rotateY-12 hover:rotateX-5`}
                style={{
                  background: `
                    linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #A0522D 75%, #8B4513 100%),
                    linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%)
                  `,
                  backgroundSize: '100% 100%, 100% 4px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundRepeat: 'no-repeat, repeat-y',
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.3), 
                    0 8px 16px rgba(0,0,0,0.4),
                    0 4px 8px rgba(0,0,0,0.2),
                    inset 0 2px 4px rgba(255,255,255,0.1),
                    inset 0 -2px 4px rgba(0,0,0,0.2)
                  `,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <Image
                  src={image}
                  alt={`Tribal Product ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
