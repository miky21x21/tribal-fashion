'use client';

import { useEffect } from 'react';
import { initSmoothScrolling } from '@/utils/smoothScroll';

const SmoothScrollInitializer = () => {
  useEffect(() => {
    // Initialize smooth scrolling on the client side
    const initializeSmoothScrolling = () => {
      // Enable CSS smooth scrolling naturally
      if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';
        console.log('✅ Smooth scrolling enabled via CSS');
      } else {
        console.log('❌ CSS smooth scrolling not supported');
      }
      
      // Initialize the smooth scrolling utility
      initSmoothScrolling();
    };

    // Small delay to ensure DOM is ready
    setTimeout(initializeSmoothScrolling, 100);
  }, []);

  return null;
};

export default SmoothScrollInitializer;
