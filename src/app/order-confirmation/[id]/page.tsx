'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  paymentMethod: string;
  paymentId?: string;
  paymentOrderId?: string;
  paymentStatus: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order');
        }

        setOrder(data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tribal-red"></div>
      </div>
    );
  }

  if (error || !order) {
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <svg className="mx-auto h-24 w-24 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-tribal-dark font-bold mb-4" style={{fontFamily: 'Times New Roman, serif'}}>
                Order Not Found
              </h1>
              <p className="text-base sm:text-lg text-tribal-brown mb-6 sm:mb-8">
                {error || 'The order you are looking for could not be found.'}
              </p>
              
              <Link
                href="/shop"
                className="inline-block backdrop-blur-sm text-white py-2 px-6 sm:py-3 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                style={{backgroundColor: '#E35336'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1452a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E35336'}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <svg className="mx-auto h-24 w-24 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-tribal-dark font-bold mb-4" style={{fontFamily: 'Times New Roman, serif'}}>
                Order Confirmed!
              </h1>
              <p className="text-base sm:text-lg text-tribal-brown mb-4">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              <p className="text-sm text-tribal-brown opacity-80">
                Order ID: <span className="font-mono font-bold">{order.id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Order Items
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg border border-tribal-brown/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-tribal-dark text-sm sm:text-base truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-tribal-brown">
                          {item.product.category} • Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-tribal-red text-sm sm:text-base">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-tribal-brown/20 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-tribal-dark">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-tribal-red">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Delivery Information
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Name:</span>
                    <p className="text-tribal-dark font-medium">{order.shippingName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Phone:</span>
                    <p className="text-tribal-dark font-medium">{order.shippingPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Address:</span>
                    <p className="text-tribal-dark font-medium">
                      {order.shippingAddress}<br />
                      {order.shippingCity}, {order.shippingState} {order.shippingZipCode}<br />
                      {order.shippingCountry}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Payment Information
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Payment Method:</span>
                    <p className="text-tribal-dark font-medium flex items-center">
                      {order.paymentMethod === 'COD' ? (
                        <>
                          <span className="mr-2">💰</span>
                          Cash on Delivery
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💳</span>
                          Online Payment
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Payment Status:</span>
                    <p className={`font-medium flex items-center ${
                      order.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {order.paymentStatus === 'COMPLETED' ? (
                        <>
                          <span className="mr-2">✅</span>
                          Completed
                        </>
                      ) : (
                        <>
                          <span className="mr-2">⏳</span>
                          Pending
                        </>
                      )}
                    </p>
                  </div>
                  
                  {order.paymentId && (
                    <div>
                      <span className="text-sm font-medium text-tribal-brown">Transaction ID:</span>
                      <p className="text-tribal-dark font-mono text-sm">{order.paymentId}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-tribal-brown">Total Amount:</span>
                    <p className="text-tribal-red font-bold text-lg">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status & Actions */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  Order Status
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-tribal-dark font-medium">Order Placed</span>
                    <span className="text-sm text-tribal-brown ml-auto">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-tribal-brown">Processing</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-tribal-brown">Shipped</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-tribal-brown">Delivered</span>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> Your order is being processed. You will receive a confirmation email shortly. 
                    {order.paymentMethod === 'COD' ? (
                      <> Payment will be collected when your order is delivered to your address.</>
                    ) : (
                      <> Payment has been processed successfully.</>
                    )}
                    {' '}Our delivery team will contact you at {order.shippingPhone} when your order is ready for delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-tribal-dark mb-4 sm:mb-6">
                  What&apos;s Next?
                </h2>
                
                <div className="space-y-3">
                  <Link
                    href="/shop"
                    className="w-full block text-center backdrop-blur-sm text-white py-2.5 sm:py-3 px-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                    style={{backgroundColor: '#E35336'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1452a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E35336'}
                  >
                    Continue Shopping
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="w-full block text-center bg-white/60 backdrop-blur-sm text-tribal-dark py-2.5 sm:py-3 px-4 rounded-xl font-medium hover:bg-white/80 transition-all duration-300 border border-tribal-brown/30"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
