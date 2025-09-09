'use client';

import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ShippingForm>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === 'authenticated') {
      router.push('/cart');
    }
  }, [items.length, status, router]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim(),
        phone: session.user.phoneNumber || ''
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.zipCode.trim()) return 'ZIP code is required';
    
    // Basic phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid 10-digit Indian phone number';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Store shipping address in session storage for payment page
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.replace('₹', '').replace(',', ''))
        })),
        total: totalPrice,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };

      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
      
      // Redirect to payment page
      router.push('/payment');

    } catch (error) {
      console.error('Error preparing order:', error);
      setError(error instanceof Error ? error.message : 'Failed to prepare order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tribal-red"></div>
      </div>
    );
  }

  // Don't render if not authenticated or cart is empty
  if (status === 'unauthenticated' || items.length === 0) {
    return null;
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url("/images/yo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kiner text-tribal-dark font-bold mb-4">
            Checkout
          </h1>
          <p className="text-base sm:text-lg text-tribal-brown">
            Complete your order with delivery information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Delivery Information
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-tribal-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-tribal-dark mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your 10-digit phone number"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-tribal-dark mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your complete address"
                    />
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-tribal-dark mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-tribal-dark mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* ZIP Code and Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-tribal-dark mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-tribal-dark mb-2">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-tribal-brown/30 rounded-lg focus:ring-2 focus:ring-tribal-red focus:border-transparent bg-white/80 backdrop-blur-sm"
                      >
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full backdrop-blur-sm text-white py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{backgroundColor: '#E35336'}}
                      onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#d1452a')}
                      onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#E35336')}
                    >
                      {isSubmitting ? 'Proceeding to Payment...' : 'Proceed to Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden sticky top-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded-lg border border-tribal-brown/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-tribal-dark text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-tribal-brown">Qty: {item.quantity}</p>
                        <p className="font-semibold text-tribal-red text-sm">
                          ₹{parseFloat(item.price.replace('₹', '').replace(',', '')).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 border-t border-tribal-brown/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-tribal-brown">Subtotal</span>
                    <span className="font-semibold text-tribal-dark text-sm sm:text-base">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-tribal-brown">Shipping</span>
                    <span className="text-green-600 font-medium text-sm sm:text-base">Free</span>
                  </div>
                  
                  <div className="border-t border-tribal-brown/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-tribal-dark">Total</span>
                      <span className="text-lg sm:text-xl font-bold text-tribal-red">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
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
