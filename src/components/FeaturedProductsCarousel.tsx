"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { getFeaturedProductsByThemes, getFeaturedProductsWithoutTheme, FeaturedTheme, Product } from "@/data/products";
import Image from "next/image";

interface ThemeSection {
  theme: FeaturedTheme;
  products: Product[];
}

function FeaturedProductsCarousel() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Get featured products organized by themes
  const themedSections = getFeaturedProductsByThemes();
  const unthemedProducts = getFeaturedProductsWithoutTheme();
  
  // Combine themed sections with unthemed products (if any)
  const allSections: ThemeSection[] = [
    ...themedSections,
    ...(unthemedProducts.length > 0 ? [{
      theme: { id: 'other', name: 'Featured', description: 'Other featured products', order: 999 },
      products: unthemedProducts
    }] : [])
  ];

  const currentSection = allSections[currentSectionIndex];
  const currentProducts = currentSection?.products || [];

  // Create duplicated products for infinite loop effect within current section
  const duplicatedProducts = currentProducts.length > 1 
    ? [...currentProducts, ...currentProducts, ...currentProducts]
    : [...currentProducts];
  const totalItems = currentProducts.length;
  const startIndex = totalItems > 1 ? totalItems : 0;

  const goToNext = useCallback(() => {
    if (isTransitioning || !currentProducts.length) return;

    setIsTransitioning(true);
    if (totalItems > 1) {
      setCurrentProductIndex((prevIndex) => prevIndex + 1);
    }
  }, [isTransitioning, currentProducts.length, totalItems]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || !currentProducts.length) return;

    setIsTransitioning(true);
    if (totalItems > 1) {
      setCurrentProductIndex((prevIndex) => prevIndex - 1);
    }
  }, [isTransitioning, currentProducts.length, totalItems]);

  const goToSection = useCallback((sectionIndex: number) => {
    if (isTransitioning || sectionIndex === currentSectionIndex) return;
    
    setCurrentSectionIndex(sectionIndex);
    setCurrentProductIndex(totalItems > 1 ? totalItems : 0); // Reset to start position
  }, [isTransitioning, currentSectionIndex, totalItems]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || totalItems <= 1) return;

      setIsTransitioning(true);
      setCurrentProductIndex(startIndex + index);
    },
    [isTransitioning, startIndex, totalItems]
  );

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || totalItems <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, totalItems]);

  // Handle transition end to create infinite loop effect
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    if (totalItems <= 1) return;

    // Reset to middle set when reaching the end of duplicated products
    if (currentProductIndex >= totalItems * 2) {
      setCurrentProductIndex(totalItems);
    }

    // Reset to middle set when reaching the beginning of duplicated products
    if (currentProductIndex < totalItems) {
      setCurrentProductIndex(totalItems);
    }
  }, [currentProductIndex, totalItems]);

  // Reset product index when section changes
  useEffect(() => {
    setCurrentProductIndex(currentProducts.length > 1 ? currentProducts.length : 0);
  }, [currentSectionIndex, currentProducts.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (!allSections.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No featured products available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Theme Navigation */}
      {allSections.length > 1 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {allSections.map((section, index) => (
              <button
                key={section.theme.id}
                onClick={() => goToSection(index)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                  index === currentSectionIndex
                    ? "bg-tribal-red text-white shadow-lg"
                    : "bg-white text-tribal-brown border-2 border-tribal-red hover:bg-tribal-red hover:text-white"
                }`}
                aria-current={index === currentSectionIndex ? "page" : undefined}
              >
                {section.theme.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Theme Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-tribal-brown mb-2">
          {currentSection.theme.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          {currentSection.theme.description}
        </p>
      </div>

      {/* Carousel Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        ref={carouselRef}
        role="region"
        aria-label={`${currentSection.theme.name} Products Carousel`}
        tabIndex={-1}
      >
        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: totalItems > 1 
                ? `translateX(-${currentProductIndex * 100}%)` 
                : 'translateX(0%)',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {duplicatedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-full px-2"
                role="group"
                aria-roledescription="slide"
                aria-label={`${(index % totalItems) + 1} of ${totalItems}`}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-tribal-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-tribal-green uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 mobile-product-name text-tribal-brown">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-tribal-red font-bold text-lg mb-4">
                      {product.price}
                    </p>
                    <button className="w-full bg-tribal-red text-white py-3 rounded-lg shadow hover:bg-tribal-green transition duration-300 font-semibold mobile-button-text">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows - only show if more than one product in current section */}
        {totalItems > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-tribal-red text-white rounded-full p-3 shadow-lg hover:bg-tribal-green transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tribal-red"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-tribal-red text-white rounded-full p-3 shadow-lg hover:bg-tribal-green transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tribal-red"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicators - only show if more than one product in current section */}
        {totalItems > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === (currentProductIndex - startIndex + totalItems) % totalItems
                    ? "bg-tribal-red"
                    : "bg-tribal-brown bg-opacity-30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  index === (currentProductIndex - startIndex + totalItems) % totalItems
                    ? "true"
                    : "false"
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(FeaturedProductsCarousel);