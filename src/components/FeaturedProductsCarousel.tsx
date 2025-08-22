"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { products } from "@/data/products";
import Image from "next/image";

function FeaturedProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Create duplicated products for infinite loop effect
  const duplicatedProducts = [...products, ...products, ...products];
  const totalItems = products.length;
  const startIndex = totalItems; // Start from the middle set of products

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  }, [isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex(startIndex + index);
    },
    [isTransitioning, startIndex]
  );

  // Handle transition end to create infinite loop effect
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    // Reset to middle set when reaching the end of duplicated products
    if (currentIndex >= totalItems * 2) {
      setCurrentIndex(totalItems);
    }

    // Reset to middle set when reaching the beginning of duplicated products
    if (currentIndex < totalItems) {
      setCurrentIndex(totalItems);
    }
  }, [currentIndex, totalItems]);

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

  // Calculate the number of slides for indicators
  const numSlides = Math.max(1, totalItems);

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      ref={carouselRef}
      role="region"
      aria-label="Featured Products Carousel"
      tabIndex={-1}
    >
      {/* Carousel container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
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
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                  <p className="text-tribal-red font-bold text-lg mb-4">
                    {product.price}
                  </p>
                  <button className="w-full bg-tribal-red text-white py-3 rounded-lg shadow hover:bg-tribal-green transition duration-300 font-semibold">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
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

      {/* Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: numSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === (currentIndex - startIndex + totalItems) % totalItems
                ? "bg-tribal-red"
                : "bg-tribal-brown bg-opacity-30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={
              index === (currentIndex - startIndex + totalItems) % totalItems
                ? "true"
                : "false"
            }
          />
        ))}
      </div>
    </div>
  );
}

export default memo(FeaturedProductsCarousel);
