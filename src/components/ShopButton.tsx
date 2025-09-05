'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * ShopButton Component
 * A floating button that appears when scrolling down and links to the shop page
 */
const ShopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) {
    return null;
  }

  return (
    <Link
      href="/shop"
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-6 shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-60 animate-bounce"
      aria-label="Go to shop"
      title="Explore our collection"
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
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </Link>
  );
};

export default ShopButton;
