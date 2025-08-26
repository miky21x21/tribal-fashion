"use client";

import { productCategories, Product } from "@/data/products";
import Image from "next/image";
import { useState } from "react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory 
    ? productCategories.find(cat => cat.id === selectedCategory)?.products || []
    : productCategories.flatMap(category => category.products);

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 bg-tribal-gradient-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center text-tribal-red">
          Explore Our Collection
        </h2>

        {/* Category Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-tribal-red text-white shadow-lg"
                  : "bg-white text-tribal-red border-2 border-tribal-red hover:bg-tribal-red hover:text-white"
              }`}
            >
              All Categories
            </button>
            {productCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-tribal-red text-white shadow-lg"
                    : "bg-white text-tribal-red border-2 border-tribal-red hover:bg-tribal-red hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Description */}
          {selectedCategory && (
            <div className="text-center mb-8">
              <p className="text-lg text-tribal-brown max-w-2xl mx-auto">
                {productCategories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-tribal-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-2">
                  <span className="text-xs font-medium text-tribal-green uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-tribal-brown">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-tribal-red font-bold text-base sm:text-lg">
                    {product.price}
                  </p>
                  <button 
                    className={`px-4 py-2 rounded-lg shadow transition duration-300 font-semibold text-sm ${
                      product.inStock
                        ? "bg-tribal-red text-white hover:bg-tribal-green"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={600}
                  height={400}
                  className="w-full h-64 sm:h-80 object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="mb-3">
                  <span className="text-sm font-medium text-tribal-green uppercase tracking-wide">
                    {selectedProduct.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-tribal-brown">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                  {selectedProduct.description}
                </p>
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-tribal-brown mb-3">Available Sizes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-tribal-cream text-tribal-brown rounded-full text-sm border border-tribal-brown"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-tribal-red font-bold text-xl sm:text-2xl">
                    {selectedProduct.price}
                  </p>
                  <button 
                    className={`px-6 py-3 rounded-lg shadow-lg transition duration-300 font-semibold ${
                      selectedProduct.inStock
                        ? "bg-tribal-red text-white hover:bg-tribal-green transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!selectedProduct.inStock}
                  >
                    {selectedProduct.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}