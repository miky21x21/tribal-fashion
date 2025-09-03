import SmoothScrollDemo from '@/components/SmoothScrollDemo';

export default function SmoothScrollDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-yellow">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-tribal-dark text-center mb-8">
          Smooth Scrolling Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-tribal-dark mb-4">
              Try the Controls
            </h2>
            <SmoothScrollDemo />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-tribal-dark mb-4">
              Features
            </h2>
            <div className="space-y-3 text-tribal-dark">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>CSS-based smooth scrolling</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>JavaScript fallback for older browsers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>Customizable duration and easing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>Offset support for fixed headers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>React hooks for easy integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-tribal-green rounded-full"></div>
                <span>Automatic anchor link handling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-16">
          <section 
            id="demo-section" 
            data-section="demo"
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold text-tribal-dark mb-4">
              Demo Section
            </h2>
            <p className="text-gray-600 mb-4">
              This section demonstrates smooth scrolling functionality. Use the controls above to test different scrolling methods.
            </p>
            <div className="bg-tribal-cream p-4 rounded">
              <p className="text-tribal-dark">
                <strong>ID:</strong> demo-section<br/>
                <strong>Data attribute:</strong> data-section="demo"<br/>
                <strong>Class:</strong> demo-selector
              </p>
            </div>
          </section>

          <section className="bg-tribal-red text-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Red Section</h2>
            <p className="mb-4">
              This section uses the tribal red background color. It's here to provide visual separation and test scrolling between different colored sections.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                Scroll up and down to see the smooth scrolling in action. Notice how the page smoothly animates between sections instead of jumping instantly.
              </p>
            </div>
          </section>

          <section className="bg-tribal-green text-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Green Section</h2>
            <p className="mb-4">
              This section demonstrates the tribal green color scheme. The smooth scrolling makes navigation feel natural and polished.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                Try using the "Scroll to Top" button that appears when you scroll down. It will smoothly take you back to the top of the page.
              </p>
            </div>
          </section>

          <section className="bg-tribal-yellow text-tribal-dark p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Yellow Section</h2>
            <p className="mb-4">
              This section showcases the tribal yellow background. Notice how smooth scrolling works consistently across all sections.
            </p>
            <div className="bg-white/50 p-4 rounded">
              <p>
                The implementation includes both CSS and JavaScript fallbacks, ensuring smooth scrolling works on all modern browsers and devices.
              </p>
            </div>
          </section>

          <section className="bg-royal-blue text-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Blue Section</h2>
            <p className="mb-4">
              This is the final section using the royal blue color. You can scroll back up using the controls or the scroll-to-top button.
            </p>
            <div className="bg-white/20 p-4 rounded">
              <p>
                The smooth scrolling functionality is now fully integrated into your website, providing a professional and polished user experience.
              </p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <a 
            href="#top" 
            className="inline-block bg-tribal-red hover:bg-tribal-red-accent text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Back to Top
          </a>
        </div>
      </div>
    </div>
  );
}
