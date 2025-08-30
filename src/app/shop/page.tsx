"use client";

import { productCategories, Product } from "@/data/products";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    
    setAddedToCart(product.id);
    
    // Clear the success message after 2 seconds
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const filteredProducts = selectedCategory 
    ? productCategories.find(cat => cat.id === selectedCategory)?.products || []
    : productCategories.flatMap(category => category.products);

  return (
    <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 bg-tribal-gradient-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center text-tribal-red">
          Explore Our Collection
        </h2>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mb-4 sm:mb-6">
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
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
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
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-base sm:text-lg text-tribal-brown max-w-2xl mx-auto">
                {productCategories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
                  className="w-full h-40 sm:h-48 md:h-64 object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-tribal-green text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Featured
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-base sm:text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="mb-2">
                  <span className="text-xs font-medium text-tribal-green uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-tribal-brown line-clamp-2">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-tribal-red font-bold text-sm sm:text-base md:text-lg">
                    {product.price}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow transition duration-300 font-semibold text-xs sm:text-sm relative ${
                      product.inStock
                        ? addedToCart === product.id
                          ? "bg-green-500 text-white"
                          : "bg-tribal-red text-white hover:bg-tribal-green"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!product.inStock}
                    data-testid="add-to-cart-button"
                  >
                    {addedToCart === product.id ? (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added!
                      </span>
                    ) : product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-t-xl sm:rounded-t-2xl"
                />
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-3">
                  <span className="text-xs sm:text-sm font-medium text-tribal-green uppercase tracking-wide">
                    {selectedProduct.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-tribal-brown">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
                  {selectedProduct.description}
                </p>
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-tribal-brown mb-2 sm:mb-3 text-sm sm:text-base">Available Sizes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-tribal-cream text-tribal-brown rounded-full text-xs sm:text-sm border border-tribal-brown"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <p className="text-tribal-red font-bold text-lg sm:text-xl md:text-2xl">
                    {selectedProduct.price}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(selectedProduct);
                    }}
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition duration-300 font-semibold text-sm sm:text-base ${
                      selectedProduct.inStock
                        ? addedToCart === selectedProduct.id
                          ? "bg-green-500 text-white"
                          : "bg-tribal-red text-white hover:bg-tribal-green transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!selectedProduct.inStock}
                    data-testid="add-to-cart-button"
                  >
                    {addedToCart === selectedProduct.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden xs:inline">Added to Cart!</span>
                        <span className="xs:hidden">Added!</span>
                      </span>
                    ) : selectedProduct.inStock ? "Add to Cart" : "Out of Stock"}
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