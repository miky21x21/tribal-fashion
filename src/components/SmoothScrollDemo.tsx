'use client';

import { useSmoothScroll } from '@/utils/useSmoothScroll';

/**
 * SmoothScrollDemo Component
 * Demonstrates various smooth scrolling functionality
 * This component can be used as a reference for implementing smooth scrolling
 */
const SmoothScrollDemo = () => {
  const {
    scrollToTop,
    scrollToElement,
    scrollToSelector,
    scrollToSection,
    scrollToWithOffset
  } = useSmoothScroll();

  const handleScrollToTop = () => {
    scrollToTop({ duration: 1200, easing: 'bounce' });
  };

  const handleScrollToElement = () => {
    scrollToElement('demo-section', { duration: 1000, easing: 'elastic' });
  };

  const handleScrollToSelector = () => {
    scrollToSelector('.demo-selector', { duration: 1000, easing: 'easeInOut' });
  };

  const handleScrollToSection = () => {
    scrollToSection('demo', { duration: 800, easing: 'easeOut' });
  };

  const handleScrollWithOffset = () => {
    scrollToWithOffset('#demo-section', 100, { duration: 1000, easing: 'bounce' });
  };

  return (
    <div className="p-6 bg-tribal-cream rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-tribal-dark mb-4">
        Enhanced Smooth Scrolling Demo
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={handleScrollToTop}
          className="w-full bg-tribal-red hover:bg-tribal-red-accent text-white py-3 px-4 rounded transition-all duration-200 hover:scale-105"
        >
          🎯 Scroll to Top (Bounce Effect)
        </button>
        
        <button
          onClick={handleScrollToElement}
          className="w-full bg-tribal-green hover:bg-tribal-green/80 text-white py-3 px-4 rounded transition-all duration-200 hover:scale-105"
        >
          🚀 Scroll to Element (Elastic Effect)
        </button>
        
        <button
          onClick={handleScrollToSelector}
          className="w-full bg-tribal-yellow hover:bg-tribal-yellow/80 text-tribal-dark py-3 px-4 rounded transition-all duration-200 hover:scale-105"
        >
          🎨 Scroll to Selector (Smooth)
        </button>
        
        <button
          onClick={handleScrollToSection}
          className="w-full bg-tribal-brown hover:bg-tribal-brown/80 text-white py-3 px-4 rounded transition-all duration-200 hover:scale-105"
        >
          📍 Scroll to Section (Ease Out)
        </button>
        
        <button
          onClick={handleScrollWithOffset}
          className="w-full bg-royal-blue hover:bg-royal-blue/80 text-white py-3 px-4 rounded transition-all duration-200 hover:scale-105"
        >
          🎪 Scroll with Offset (Bounce)
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-white rounded border">
        <h4 className="font-semibold text-tribal-dark mb-2">Enhanced Features:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <code>scrollToTop()</code> - Bounce effect for fun!</p>
          <p>• <code>scrollToElement()</code> - Elastic easing for natural feel</p>
          <p>• <code>scrollToSelector()</code> - Smooth easeInOut</p>
          <p>• <code>scrollToSection()</code> - Ease out for gentle stops</p>
          <p>• <code>scrollToWithOffset()</code> - Bounce with offset</p>
        </div>
        <div className="mt-3 p-3 bg-tribal-cream rounded text-xs">
          <p className="text-tribal-dark font-semibold">New Easing Functions:</p>
          <p>🎯 <strong>Bounce:</strong> Playful bouncing effect</p>
          <p>🔄 <strong>Elastic:</strong> Natural elastic motion</p>
          <p>⚡ <strong>Enhanced:</strong> Longer duration for visibility</p>
        </div>
      </div>
    </div>
  );
};

export default SmoothScrollDemo;
