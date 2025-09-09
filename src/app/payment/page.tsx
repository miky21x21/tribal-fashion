'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'online' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load order data from session storage
  useEffect(() => {
    if (status === 'authenticated') {
      const storedOrder = sessionStorage.getItem('pendingOrder');
      if (storedOrder) {
        try {
          setOrderData(JSON.parse(storedOrder));
        } catch (error) {
          console.error('Error parsing order data:', error);
          router.push('/cart');
        }
      } else {
        router.push('/cart');
      }
    }
  }, [status, router]);

  const handlePaymentMethodSelect = (method: 'cod' | 'online') => {
    setSelectedPaymentMethod(method);
    setError('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod || !orderData) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      if (selectedPaymentMethod === 'cod') {
        // Place order directly for COD
        await placeOrder('COD');
      } else {
        // Initiate online payment
        await initiateOnlinePayment();
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const placeOrder = async (paymentMethod: string) => {
    if (!orderData) return;

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        paymentMethod
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to place order');
    }

    setSuccess('Order placed successfully!');
    
    // Clear session storage and redirect to confirmation
    sessionStorage.removeItem('pendingOrder');
    setTimeout(() => {
      router.push(`/order-confirmation/${data.data.id}`);
    }, 1500);
  };

  const initiateOnlinePayment = async () => {
    if (!orderData) return;

    // Create Razorpay order
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(orderData.total * 100), // Convert to paise
        currency: 'INR',
        orderData
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment order');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Tribal Fashion',
        description: `Order for ${orderData.shippingAddress.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            setSuccess('Payment successful! Order placed.');
            
            // Clear session storage and redirect to confirmation
            sessionStorage.removeItem('pendingOrder');
            setTimeout(() => {
              router.push(`/order-confirmation/${verifyData.data.id}`);
            }, 1500);

          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: orderData.shippingAddress.name,
          email: session?.user?.email || '',
          contact: orderData.shippingAddress.phone,
        },
        theme: {
          color: '#E35336',
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tribal-red"></div>
      </div>
    );
  }

  // Don't render if not authenticated or no order data
  if (status === 'unauthenticated' || !orderData) {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kiner text-tribal-dark font-bold mb-4">
            Payment
          </h1>
          <p className="text-base sm:text-lg text-tribal-brown">
            Choose your preferred payment method
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Select Payment Method
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

                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === 'cod' 
                        ? 'border-tribal-red bg-tribal-red/10' 
                        : 'border-tribal-brown/30 bg-white/60 hover:bg-white/80'
                    }`}
                    onClick={() => handlePaymentMethodSelect('cod')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'cod' 
                          ? 'border-tribal-red bg-tribal-red' 
                          : 'border-tribal-brown/50'
                      }`}>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-tribal-dark text-lg">Cash on Delivery</h3>
                        <p className="text-tribal-brown text-sm">
                          Pay when your order is delivered to your doorstep
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            No extra charges
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Available everywhere
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl">💰</div>
                    </div>
                  </div>

                  {/* Online Payment */}
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === 'online' 
                        ? 'border-tribal-red bg-tribal-red/10' 
                        : 'border-tribal-brown/30 bg-white/60 hover:bg-white/80'
                    }`}
                    onClick={() => handlePaymentMethodSelect('online')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'online' 
                          ? 'border-tribal-red bg-tribal-red' 
                          : 'border-tribal-brown/50'
                      }`}>
                        {selectedPaymentMethod === 'online' && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-tribal-dark text-lg">Online Payment</h3>
                        <p className="text-tribal-brown text-sm">
                          Pay securely with cards, UPI, net banking, or digital wallets
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Secure
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Instant confirmation
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          <span className="text-xs text-tribal-brown">Accepted:</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Cards</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">📱 UPI</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">🏦 Net Banking</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Wallets</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl">💳</div>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!selectedPaymentMethod || isProcessing}
                    className="w-full backdrop-blur-sm text-white py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{backgroundColor: '#E35336'}}
                    onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = '#d1452a')}
                    onMouseLeave={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = '#E35336')}
                  >
                    {isProcessing 
                      ? (selectedPaymentMethod === 'cod' ? 'Placing Order...' : 'Processing Payment...') 
                      : (selectedPaymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now')
                    }
                  </button>
                </div>
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
                
                {/* Delivery Address */}
                <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                  <h3 className="font-medium text-tribal-dark text-sm mb-2">Delivery Address</h3>
                  <p className="text-xs text-tribal-brown">
                    {orderData.shippingAddress.name}<br />
                    {orderData.shippingAddress.address}<br />
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}<br />
                    {orderData.shippingAddress.country}
                  </p>
                  <p className="text-xs text-tribal-brown mt-1">
                    📞 {orderData.shippingAddress.phone}
                  </p>
                </div>
                
                <div className="space-y-3 border-t border-tribal-brown/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-tribal-brown">Subtotal</span>
                    <span className="font-semibold text-tribal-dark text-sm sm:text-base">
                      ₹{orderData.total.toFixed(2)}
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
                        ₹{orderData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs text-tribal-brown opacity-80">
                    {selectedPaymentMethod === 'cod' 
                      ? 'Pay when your order is delivered' 
                      : 'Secure payment with SSL encryption'
                    }
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
