"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };

  const formatPrice = (price: string) => {
    return price.replace(/[^\d.,]/g, '').replace(',', '');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <svg className="mx-auto h-24 w-24 text-tribal-brown/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-kiner text-tribal-dark font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-base sm:text-lg text-tribal-brown mb-6 sm:mb-8">Discover our amazing collection of tribal fashion</p>
              
              <Link
                href="/shop"
                className="inline-block bg-tribal-red/90 backdrop-blur-sm text-white py-2 px-6 sm:py-3 sm:px-8 rounded-xl font-bold text-base sm:text-lg hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kiner text-tribal-dark font-bold mb-4">Shopping Cart</h1>
          <p className="text-base sm:text-lg text-tribal-brown">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-bold text-tribal-dark">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-xs sm:text-sm text-tribal-red hover:text-tribal-red-accent transition duration-300 font-medium"
                  >
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="bg-white/60 backdrop-blur-sm border border-tribal-brown/20 rounded-xl p-3 sm:p-4 transition-all duration-300 hover:bg-white/80"
                      data-testid="cart-item"
                    >
                      <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-3 xs:space-y-0 xs:space-x-3 sm:space-x-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-tribal-brown/20 mx-auto xs:mx-0"
                        />
                        
                        <div className="flex-1 min-w-0 text-center xs:text-left">
                          <h3 className="font-semibold text-tribal-dark text-base sm:text-lg truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-tribal-brown opacity-80">{item.category}</p>
                          <p className="font-bold text-tribal-red text-base sm:text-lg mt-1" data-testid="item-price">
                            ₹{formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col xs:flex-row items-center space-y-2 xs:space-y-0 xs:space-x-3 w-full xs:w-auto">
                          <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 backdrop-blur-sm rounded-lg border border-tribal-brown/30">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="p-1.5 sm:p-2 hover:bg-tribal-red hover:text-white transition duration-300 rounded-l-lg"
                              data-testid="quantity-decrease"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span 
                              className="px-2 py-1.5 sm:px-4 sm:py-2 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm"
                              data-testid="item-quantity"
                            >
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="p-1.5 sm:p-2 hover:bg-tribal-red hover:text-white transition duration-300 rounded-r-lg"
                              data-testid="quantity-increase"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-300"
                            title="Remove item"
                            data-testid="remove-item-button"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden sticky top-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">Order Summary</h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-tribal-brown">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-tribal-dark text-sm sm:text-base" data-testid="cart-subtotal">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-tribal-brown">Shipping</span>
                    <span className="text-green-600 font-medium text-sm sm:text-base">Free</span>
                  </div>
                  
                  <div className="border-t border-tribal-brown/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-tribal-dark">Total</span>
                      <span className="text-lg sm:text-xl font-bold text-tribal-red" data-testid="cart-total">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    className="w-full bg-tribal-red/90 backdrop-blur-sm text-white py-2.5 sm:py-3 px-4 rounded-xl font-bold text-base sm:text-lg hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link
                    href="/shop"
                    className="w-full block text-center bg-white/60 backdrop-blur-sm text-tribal-dark py-2.5 sm:py-3 px-4 rounded-xl font-medium hover:bg-white/80 transition-all duration-300 border border-tribal-brown/30"
                  >
                    Continue Shopping
                  </Link>
                </div>
                
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs text-tribal-brown opacity-80">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}