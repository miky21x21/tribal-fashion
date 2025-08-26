export default function AboutPage() {
  return (
    <main className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 bg-tribal-gradient-cream">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-tribal-red text-center">
          About Us
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg md:text-xl text-tribal-brown leading-relaxed mb-4 sm:mb-6">
            We celebrate the rich tribal heritage of Jharkhand through unique
            handmade fashion and crafts.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-tribal-brown leading-relaxed mb-4 sm:mb-6">
            Our mission is to preserve and promote the traditional artistry of
            Jharkhand&apos;s tribal communities by bringing their exquisite
            craftsmanship to a global audience.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-tribal-brown leading-relaxed">
            Each piece in our collection tells a story of cultural heritage,
            passed down through generations of skilled artisans who dedicate
            their lives to keeping these traditions alive.
          </p>
        </div>
      </div>
    </main>
  );
}
