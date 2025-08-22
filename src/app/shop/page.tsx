import { products } from "@/data/products";
import Image from "next/image";

export default function ShopPage() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 bg-tribal-gradient-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center text-tribal-red">
          Shop Our Collection
        </h2>

        {/* ✅ Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {product.name}
                </h3>
                <p className="text-tribal-red font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  {product.price}
                </p>
                <button className="w-full bg-tribal-red text-white py-2 sm:py-3 rounded-lg shadow hover:bg-tribal-green transition duration-300 font-semibold text-sm sm:text-base">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
