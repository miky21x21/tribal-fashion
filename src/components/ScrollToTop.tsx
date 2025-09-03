'use client';

import { useState, useEffect } from 'react';
import { useSmoothScroll } from '@/utils/useSmoothScroll';

/**
 * ScrollToTop Component
 * A floating button that appears when scrolling down and smoothly scrolls to top when clicked
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    // Use enhanced smooth scrolling with bounce effect for more noticeable animation
    scrollToTop({ 
      duration: 1200, 
      easing: 'bounce',
      offset: 0
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-tribal-red hover:bg-tribal-red-accent text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-tribal-red focus:ring-opacity-50 animate-pulse"
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
