'use client';

import { useEffect, useState } from 'react';

interface CollageItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

const mockCollageItems: CollageItem[] = [
  {
    id: '1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582273166316-e8db58e5fcc7?w=400&h=300&fit=crop&crop=center',
    alt: 'Tribal pottery'
  },
  {
    id: '2',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '3',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    alt: 'Handwoven textile'
  },
  {
    id: '4',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop&crop=center',
    alt: 'Traditional jewelry'
  },
  {
    id: '5',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '6',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop&crop=center',
    alt: 'Wooden crafts'
  },
  {
    id: '7',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1578662995432-eb63c39e4a42?w=400&h=300&fit=crop&crop=center',
    alt: 'Traditional masks'
  },
  {
    id: '8',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: '9',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582273166316-e8db58e5fcc7?w=400&h=300&fit=crop&crop=center',
    alt: 'Tribal art'
  }
];

export default function ProductCollage() {
  const [shuffledItems, setShuffledItems] = useState<CollageItem[]>(mockCollageItems);

  const shuffleArray = (array: CollageItem[]): CollageItem[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffledItems(current => shuffleArray(current));
    }, 4000); // Shuffle every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-[#a0c878] via-[#8BB665] to-[#76A452] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center font-tribal mb-12 sm:mb-16 text-tribal-red mobile-title-wrap">
          Our Craft
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 max-h-[600px] overflow-hidden">
          {shuffledItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`
                relative overflow-hidden rounded-lg shadow-lg
                transition-all duration-1000 ease-in-out transform
                ${index === 0 ? 'col-span-2 row-span-2' : ''}
                ${index === 4 ? 'md:col-span-2' : ''}
                ${index % 3 === 0 ? 'animate-fade-slide-up' : ''}
                ${index % 3 === 1 ? 'animate-fade-slide-right' : ''}
                ${index % 3 === 2 ? 'animate-fade-slide-left' : ''}
              `}
              style={{
                animationDelay: `${index * 200}ms`,
                minHeight: index === 0 ? '300px' : '150px'
              }}
            >
              {item.type === 'image' ? (
                /* eslint-disable @next/next/no-img-element */
                <img
                  src={item.src}
                  alt={item.alt || 'Tribal craft'}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                /* eslint-enable @next/next/no-img-element */
              ) : (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              )}
              
              {/* Overlay with subtle tribal pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-tribal-brown/20 pointer-events-none" />
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-tribal-red/0 hover:bg-tribal-red/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-tribal-red text-lg md:text-xl mb-6 max-w-2xl mx-auto font-['Limelight']">
            Discover the rich tapestry of Jharkhand&apos;s tribal craftsmanship through our curated collection of authentic handmade products.
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