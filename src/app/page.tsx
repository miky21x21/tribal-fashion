import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import Hero from "@/components/Hero";
import ProductCollage from "@/components/ProductCollage";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Product Collage Section */}
      <ProductCollage />

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-[#CA7842]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold text-center font-tribal mb-12 sm:mb-16 text-tribal-red mobile-title-wrap">
            Featured Products
          </h2>
          <FeaturedProductsCarousel />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-tribal-gradient-red text-tribal-cream text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 font-tribal mobile-title-wrap">
            Celebrating Tribal Heritage
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed mobile-text-wrap">
            We honor Jharkhand&apos;s tribal artisans by bringing you authentic
            handcrafted products that tell a story of tradition and
            craftsmanship.
          </p>
          <a
            href="/shop"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-tribal-cream text-tribal-brown rounded-full shadow-lg hover:bg-tribal-green transition duration-300 font-bold text-base sm:text-lg inline-block transform hover:scale-105 mobile-button-text"
          >
            Shop Now
          </a>
        </div>
      </section>
    </main>
  );
}