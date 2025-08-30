"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { getThemesWithProducts } from "../data/products";
import type { ProductTheme, Product } from "../data/products";
import Image from "next/image";

/**
 * THEMED CAROUSEL COMPONENT
 * ========================================================================================
 * This carousel displays theme-based tiles instead of individual product tiles.
 * Each tile represents a product theme with its associated products and colors.
 * 
 * STRUCTURE:
 * - Displays maximum 3 theme tiles at once
 * - Each tile has a theme-specific background color
 * - Navigation controls for cycling through themes
 * - Auto-play functionality with pause on hover
 * 
 * TO ADD NEW THEMES:
 * 1. Add theme definition to productThemes array in src/data/products.ts
 * 2. Ensure corresponding CSS color classes exist in src/app/globals.css
 * 3. No changes needed to this component - it automatically picks up new themes
 * ========================================================================================
 */

function FeaturedProductsCarousel() {
  // Carousel state management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Get all themes with their associated products
  // This automatically includes any new themes defined in the data file
  const themesWithProducts = getThemesWithProducts();

  /**
   * CAROUSEL CONFIGURATION
   * =====================================================================================
   * maxTilesVisible: Maximum number of theme tiles to show at once (default: 3)
   * To change this, modify the value below and update the grid CSS classes accordingly
   * =====================================================================================
   */
  const maxTilesVisible = 3;
  const totalThemes = themesWithProducts.length;

  // Navigation functions with transition handling
  const goToNext = useCallback(() => {
    if (isTransitioning || totalThemes === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalThemes);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, totalThemes]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || totalThemes === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalThemes) % totalThemes);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, totalThemes]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || totalThemes === 0) return;

      setIsTransitioning(true);
      setCurrentIndex(index);
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, totalThemes]
  );

  /**
   * AUTO-PLAY FUNCTIONALITY
   * =====================================================================================
   * Automatically advances to next theme every 6 seconds
   * Pauses when user hovers over carousel
   * =====================================================================================
   */
  useEffect(() => {
    if (!isAutoPlaying || totalThemes <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, totalThemes]);

  // Keyboard navigation support
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

  /**
   * THEME TILE RENDERING LOGIC
   * =====================================================================================
   * Each theme tile displays:
   * - Theme-colored background
   * - Theme name and description
   * - Grid of associated products (max 4 visible)
   * - Product count indicator
   * =====================================================================================
   */
  const renderThemeTile = (theme: ProductTheme & { products: Product[] }, index: number) => {
    // Determine background color class based on theme.color
    // This maps the color string from theme data to actual CSS classes
    const getBackgroundClass = (colorName: string) => {
      switch (colorName) {
        case 'tribal-red':
          return 'bg-tribal-red';
        case 'royal-blue':
          return 'bg-royal-blue';
        case 'royal-green':
          return 'bg-royal-green';
        default:
          return 'bg-tribal-cream'; // fallback color
      }
    };

    const backgroundClass = getBackgroundClass(theme.color);
    const textColorClass = theme.color === 'tribal-red' || theme.color === 'royal-blue' || theme.color === 'royal-green' 
      ? 'text-white' 
      : 'text-tribal-dark';

    return (
      <div
        key={`${theme.id}-${index}`}
        className="flex-shrink-0 w-full px-2"
        role="group"
        aria-roledescription="theme slide"
        aria-label={`${theme.name} theme, ${index + 1} of ${totalThemes}`}
      >
        <div 
          className={`${backgroundClass} ${textColorClass} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 h-full min-h-[400px]`}
        >
          {/* Theme Header */}
          <div className="p-6 pb-4">
            <div className="mb-2">
              <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                Theme Collection
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3 mobile-product-name">
              {theme.name}
            </h3>
            <p className="text-sm mb-4 leading-relaxed opacity-90">
              {theme.description}
            </p>
            <div className="text-xs opacity-75">
              {theme.products.length} {theme.products.length === 1 ? 'Product' : 'Products'}
            </div>
          </div>

          {/* Products Preview Grid */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {theme.products.slice(0, 4).map((product) => (
                <div 
                  key={product.id}
                  className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
                >
                  <div className="aspect-square relative mb-2 overflow-hidden rounded-md">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-medium truncate opacity-90">
                    {product.name}
                  </div>
                  <div className="text-xs font-bold mt-1">
                    {product.price}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show more indicator if there are additional products */}
            {theme.products.length > 4 && (
              <div className="text-center mt-3">
                <div className="text-xs opacity-75">
                  +{theme.products.length - 4} more {theme.products.length - 4 === 1 ? 'product' : 'products'}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-4">
              <button className="w-full bg-white bg-opacity-20 text-white py-3 rounded-lg shadow hover:bg-opacity-30 transition duration-300 font-semibold backdrop-blur-sm mobile-button-text">
                Explore {theme.name} Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * VISIBLE TILES CALCULATION
   * =====================================================================================
   * Determines which theme tiles should be visible based on current index
   * Handles wrapping around when reaching the end of available themes
   * =====================================================================================
   */
  const getVisibleThemes = () => {
    if (totalThemes === 0) return [];
    if (totalThemes <= maxTilesVisible) return themesWithProducts;

    const visibleThemes = [];
    for (let i = 0; i < Math.min(maxTilesVisible, totalThemes); i++) {
      const themeIndex = (currentIndex + i) % totalThemes;
      visibleThemes.push(themesWithProducts[themeIndex]);
    }
    return visibleThemes;
  };

  const visibleThemes = getVisibleThemes();

  // Don't render if no themes available
  if (totalThemes === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-tribal-brown">No themed collections available.</p>
      </div>
    );
  }

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      ref={carouselRef}
      role="region"
      aria-label="Featured Product Themes Carousel"
      tabIndex={-1}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            visibleThemes.length === 1 ? 'grid-cols-1' :
            visibleThemes.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          } gap-4`}
        >
          {visibleThemes.map((theme, index) => renderThemeTile(theme, index))}
        </div>
      </div>

      {/* Navigation Controls - Only show if more themes than max visible */}
      {totalThemes > maxTilesVisible && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-tribal-red text-white rounded-full p-3 shadow-lg hover:bg-tribal-green transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tribal-red z-10"
            aria-label="Previous theme"
            disabled={isTransitioning}
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-tribal-red text-white rounded-full p-3 shadow-lg hover:bg-tribal-green transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tribal-red z-10"
            aria-label="Next theme"
            disabled={isTransitioning}
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

      {/* Theme Indicators */}
      {totalThemes > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {themesWithProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-tribal-red"
                  : "bg-tribal-brown bg-opacity-30 hover:bg-opacity-50"
              }`}
              aria-label={`Go to ${themesWithProducts[index]?.name} theme`}
              aria-current={index === currentIndex ? "true" : "false"}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(FeaturedProductsCarousel);