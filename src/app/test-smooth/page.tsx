'use client';

import { useEffect } from 'react';

export default function TestSmoothPage() {
  useEffect(() => {
    // Test natural smooth scrolling on page load
    const testSmoothScrolling = () => {
      // Enable smooth scrolling naturally
      if ('scrollBehavior' in document.documentElement.style) {
        console.log('✅ CSS smooth scrolling is supported');
        
        // Test natural smooth scroll to bottom after 3 seconds
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
            left: 0
          });
        }, 3000);
        
        // Test natural smooth scroll to top after 6 seconds
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
            left: 0
          });
        }, 6000);
      } else {
        console.log('❌ CSS smooth scrolling is NOT supported');
      }
    };

    testSmoothScrolling();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use natural smooth scrolling
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const scrollToTop = () => {
    // Natural smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      left: 0
    });
  };

  const scrollToBottom = () => {
    // Natural smooth scroll to bottom
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
      left: 0
    });
  };

  const testNaturalScroll = () => {
    // Test natural scrolling with smooth steps
    let currentPosition = window.pageYOffset;
    const targetPosition = document.body.scrollHeight;
    const distance = targetPosition - currentPosition;
    
    // Scroll in natural, smooth steps
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        const step = i / 8;
        const easedStep = step < 0.5 ? 
          2 * step * step : 
          -1 + (4 - 2 * step) * step;
        
        window.scrollTo(0, currentPosition + (distance * easedStep));
      }, i * 150);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-yellow">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-tribal-dark text-center mb-8">
          🎯 Natural Gliding Smooth Scrolling Test
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-lg text-tribal-dark mb-4">
            This page tests natural, gliding smooth scrolling. Watch for automatic scrolling after 3 and 6 seconds!
          </p>
          
          <div className="space-x-4">
            <button
              onClick={() => scrollToSection('section1')}
              className="bg-tribal-red hover:bg-tribal-red-accent text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              🎯 Go to Section 1
            </button>
            
            <button
              onClick={() => scrollToSection('section2')}
              className="bg-tribal-green hover:bg-tribal-green/80 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              🚀 Go to Section 2
            </button>
            
            <button
              onClick={scrollToTop}
              className="bg-tribal-blue hover:bg-tribal-blue/80 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              ⬆️ Scroll to Top
            </button>
            
            <button
              onClick={scrollToBottom}
              className="bg-tribal-brown hover:bg-tribal-brown/80 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              ⬇️ Scroll to Bottom
            </button>
            
            <button
              onClick={testNaturalScroll}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              🌊 Test Natural Scroll
            </button>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-16">
          <section 
            id="section1"
            className="bg-white p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-3xl font-bold text-tribal-dark mb-4">
              🎯 Section 1 - Natural Smooth Scrolling
            </h2>
            <p className="text-gray-600 mb-4">
              This section demonstrates natural, gliding smooth scrolling. The motion should feel like the page is gliding smoothly.
            </p>
            <div className="bg-tribal-cream p-4 rounded">
              <p className="text-tribal-dark">
                <strong>ID:</strong> section1<br/>
                <strong>Scroll behavior:</strong> smooth<br/>
                <strong>Feel:</strong> Natural gliding motion
              </p>
            </div>
          </section>

          <section 
            id="section2"
            className="bg-tribal-red text-white p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-3xl font-bold mb-4">🚀 Section 2 - Gliding Experience</h2>
            <p className="mb-4">
              Notice how smooth and natural the scrolling feels. It should glide like silk on both mobile and desktop.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                The smooth scrolling should feel natural and effortless, not forced or dramatic.
              </p>
            </div>
          </section>

          <section className="bg-tribal-green text-white p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-4">🌊 Section 3 - Natural Motion</h2>
            <p className="mb-4">
              This section showcases the natural motion of smooth scrolling. It should feel like the page is floating.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                Look for smooth acceleration and deceleration that feels natural and pleasant.
              </p>
            </div>
          </section>

          <section className="bg-tribal-yellow text-tribal-dark p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-4">✨ Section 4 - Enhanced Scrollbar</h2>
            <p className="mb-4">
              Notice the enhanced scrollbar with tribal colors. It provides visual feedback during the gliding motion.
            </p>
            <div className="bg-white/50 p-4 rounded">
              <p>
                The scrollbar should be visible and styled with tribal colors for a cohesive experience.
              </p>
            </div>
          </section>

          <section className="bg-royal-blue text-white p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-4">🎯 Section 5 - Perfect Gliding</h2>
            <p className="mb-4">
              This is the final test section. You should now feel the perfect gliding smooth scrolling!
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                If smooth scrolling is working perfectly, you'll notice:
                <br/>• 🎯 Natural acceleration and deceleration
                <br/>• 🌊 Smooth gliding motion like silk
                <br/>• ✨ Enhanced scrollbar with tribal styling
                <br/>• 🚀 Perfect performance on mobile and desktop
                <br/>• 🎪 Natural duration that feels right
              </p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <a 
            href="#top" 
            className="inline-block bg-tribal-red hover:bg-tribal-red-accent text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            🎯 Back to Top (Natural Anchor Link)
          </a>
        </div>
      </div>
    </div>
  );
}
