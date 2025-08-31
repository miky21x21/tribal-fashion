"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isLoading: boolean;
  isSaving: boolean;
  isVerifyingPhone: boolean;
  isLoadingOrders: boolean;
  error: string;
  success: string;
  showPhoneVerification: boolean;
  newPhoneNumber: string;
  otpCode: string;
  otpSent: boolean;
  orders: Order[];
  selectedOrder: Order | null;
  showOrderDetails: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isLoading: true,
    isSaving: false,
    isVerifyingPhone: false,
    isLoadingOrders: false,
    error: "",
    success: "",
    showPhoneVerification: false,
    newPhoneNumber: "",
    otpCode: "",
    otpSent: false,
    orders: [],
    selectedOrder: null,
    showOrderDetails: false,
  });

  useEffect(() => {
    loadUserProfile();
    loadUserOrders();
  }, [loadUserProfile, loadUserOrders]);

  const loadUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          const user = data.data;
          setState(prev => ({
            ...prev,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            avatar: user.avatar || "",
            street: user.street || "",
            apartment: user.apartment || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
            country: user.country || "India",
            isLoading: false
          }));
        } else {
          setState(prev => ({ ...prev, error: "Failed to load profile data", isLoading: false }));
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Profile load failed:', error);
      setState(prev => ({
        ...prev,
        error: "Failed to load profile",
        isLoading: false
      }));
    }
  }, [router]);

  const loadUserOrders = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoadingOrders: true }));
      
      const token = localStorage.getItem('token');
      console.log('Loading orders - Token exists:', !!token);
      
      if (!token) {
        console.log('No token found, skipping order load');
        return;
      }

      console.log('Making request to /api/orders');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Orders API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders API response data:', data);
        
        if (data.success) {
          console.log('Orders loaded successfully:', data.data?.length || 0, 'orders');
          setState(prev => ({
            ...prev,
            orders: data.data || [],
            isLoadingOrders: false
          }));
        } else {
          console.log('Orders API returned success: false');
          setState(prev => ({
            ...prev,
            orders: [],
            isLoadingOrders: false
          }));
        }
      } else {
        console.log('Orders API request failed with status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        setState(prev => ({
          ...prev,
          error: "Failed to load orders",
          isLoadingOrders: false
        }));
      }
    } catch (error) {
      console.error('Orders load failed:', error);
      setState(prev => ({
        ...prev,
        error: "Failed to load orders",
        isLoadingOrders: false
      }));
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setState(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    setState(prev => ({ ...prev, isSaving: true, error: "", success: "" }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          avatar: state.avatar,
          street: state.street,
          apartment: state.apartment,
          city: state.city,
          state: state.state,
          zipCode: state.zipCode,
          country: state.country
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isSaving: false,
          success: "Profile updated successfully!"
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setState(prev => ({ ...prev, success: "" }));
        }, 3000);
      } else {
        setState(prev => ({
          ...prev,
          isSaving: false,
          error: data.message || 'Failed to update profile'
        }));
      }
    } catch (_error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handlePhoneUpdate = async () => {
    if (!state.newPhoneNumber) {
      setState(prev => ({ ...prev, error: "Please enter a phone number" }));
      return;
    }

    setState(prev => ({ ...prev, isVerifyingPhone: true, error: "" }));

    try {
      const response = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: state.newPhoneNumber,
          action: 'send'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isVerifyingPhone: false,
          otpSent: true,
          success: data.message + (data.developmentCode ? ` (Dev Code: ${data.developmentCode})` : "")
        }));
      } else {
        setState(prev => ({
          ...prev,
          isVerifyingPhone: false,
          error: data.message || 'Failed to send OTP'
        }));
      }
    } catch (_error) {
      setState(prev => ({
        ...prev,
        isVerifyingPhone: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleOtpVerification = async () => {
    if (!state.otpCode) {
      setState(prev => ({ ...prev, error: "Please enter the OTP code" }));
      return;
    }

    setState(prev => ({ ...prev, isVerifyingPhone: true, error: "" }));

    try {
      const response = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: state.newPhoneNumber,
          code: state.otpCode,
          action: 'verify'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Now update the phone number in the profile
        const token = localStorage.getItem('token');
        const updateResponse = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            avatar: state.avatar,
            phoneNumber: state.newPhoneNumber,
            street: state.street,
            apartment: state.apartment,
            city: state.city,
            state: state.state,
            zipCode: state.zipCode,
            country: state.country
          })
        });

        const updateData = await updateResponse.json();
        
        if (updateData.success) {
          setState(prev => ({
            ...prev,
            isVerifyingPhone: false,
            showPhoneVerification: false,
            phoneNumber: prev.newPhoneNumber,
            newPhoneNumber: "",
            otpCode: "",
            otpSent: false,
            success: "Phone number updated successfully!"
          }));
        } else {
          setState(prev => ({
            ...prev,
            isVerifyingPhone: false,
            error: updateData.message || 'Failed to update phone number'
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isVerifyingPhone: false,
          error: data.message || 'Invalid OTP'
        }));
      }
    } catch (_error) {
      setState(prev => ({
        ...prev,
        isVerifyingPhone: false,
        error: 'Network error. Please try again.'
      }));
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-100';
      case 'SHIPPED':
        return 'text-blue-600 bg-blue-100';
      case 'PROCESSING':
        return 'text-yellow-600 bg-yellow-100';
      case 'PENDING':
        return 'text-gray-600 bg-gray-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tribal-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light py-6 px-3 sm:py-12 sm:px-4 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-kiner text-tribal-dark font-bold mb-2">Edit Profile</h1>
            <p className="text-xs sm:text-sm text-tribal-brown opacity-80 font-medium">Manage your account information</p>
          </div>

          {/* Error and Success Messages */}
          {state.error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100/80 backdrop-blur-sm border border-red-400/50 text-red-700 rounded-xl text-xs sm:text-sm">
              {state.error}
            </div>
          )}
          
          {state.success && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100/80 backdrop-blur-sm border border-green-400/50 text-green-700 rounded-xl text-xs sm:text-sm">
              {state.success}
            </div>
          )}

          <div className="relative z-10 space-y-4 sm:space-y-6">
            {/* Profile Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                {state.avatar ? (
                  <Image
                    src={state.avatar}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 rounded-full bg-gradient-to-br from-tribal-red to-tribal-red-accent flex items-center justify-center text-white text-lg sm:text-xl md:text-3xl font-bold border-4 border-white/30 shadow-lg">
                    {getInitials(state.firstName, state.lastName) || 'U'}
                  </div>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-tribal-red text-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-tribal-red-accent transition duration-300"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-tribal-brown opacity-70 mt-2">Click the camera icon to update your profile photo</p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">First Name</label>
                <input
                  type="text"
                  value={state.firstName}
                  onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Last Name</label>
                <input
                  type="text"
                  value={state.lastName}
                  onChange={(e) => setState(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Email</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              />
            </div>

            {/* Phone Number Section */}
            <div>
              <label className="block text-sm font-medium text-tribal-dark mb-2">Phone Number</label>
              <div className="flex items-center space-x-3">
                <input
                  type="tel"
                  value={state.phoneNumber}
                  readOnly
                  className="flex-1 border border-tribal-brown/30 bg-white/60 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium cursor-not-allowed"
                />
                <button
                  onClick={() => setState(prev => ({ ...prev, showPhoneVerification: true }))}
                  className="bg-tribal-red/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-tribal-red-accent/90 transition duration-300 border border-white/20"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Phone Verification Modal */}
            {state.showPhoneVerification && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-tribal-dark mb-4">Update Phone Number</h3>
                  
                  {!state.otpSent ? (
                    <div className="space-y-4">
                      <input
                        type="tel"
                        value={state.newPhoneNumber}
                        onChange={(e) => setState(prev => ({ ...prev, newPhoneNumber: e.target.value }))}
                        placeholder="Enter new phone number"
                        className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                      />
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setState(prev => ({ ...prev, showPhoneVerification: false, newPhoneNumber: "" }))}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-400 transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePhoneUpdate}
                          disabled={state.isVerifyingPhone}
                          className="flex-1 bg-tribal-red text-white py-3 rounded-xl font-medium text-sm hover:bg-tribal-red-accent disabled:opacity-50 transition duration-300 flex items-center justify-center"
                        >
                          {state.isVerifyingPhone ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-tribal-brown">Enter the OTP sent to {state.newPhoneNumber}</p>
                      
                      <input
                        type="text"
                        value={state.otpCode}
                        onChange={(e) => setState(prev => ({ ...prev, otpCode: e.target.value }))}
                        placeholder="Enter OTP code"
                        className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                      />
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setState(prev => ({ ...prev, showPhoneVerification: false, newPhoneNumber: "", otpCode: "", otpSent: false }))}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-400 transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleOtpVerification}
                          disabled={state.isVerifyingPhone}
                          className="flex-1 bg-tribal-red text-white py-3 rounded-xl font-medium text-sm hover:bg-tribal-red-accent disabled:opacity-50 transition duration-300 flex items-center justify-center"
                        >
                          {state.isVerifyingPhone ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-tribal-dark mb-4">Shipping Address</h3>
              
              {/* Street Address */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Street Address</label>
                <input
                  type="text"
                  value={state.street}
                  onChange={(e) => setState(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="Enter your street address"
                  className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                />
              </div>

              {/* Apartment/Unit */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Apartment/Unit (Optional)</label>
                <input
                  type="text"
                  value={state.apartment}
                  onChange={(e) => setState(prev => ({ ...prev, apartment: e.target.value }))}
                  placeholder="Apt, suite, unit, building, floor, etc."
                  className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">City</label>
                  <input
                    type="text"
                    value={state.city}
                    onChange={(e) => setState(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                    className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">State/Province</label>
                  <input
                    type="text"
                    value={state.state}
                    onChange={(e) => setState(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Enter your state"
                    className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Zip Code and Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Zip/Postal Code</label>
                  <input
                    type="text"
                    value={state.zipCode}
                    onChange={(e) => setState(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="Enter zip code"
                    className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-tribal-dark mb-1 sm:mb-2">Country</label>
                  <select
                    value={state.country}
                    onChange={(e) => setState(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleProfileSave}
                disabled={state.isSaving}
                className="bg-tribal-red/90 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-tribal-red-accent/90 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20 flex items-center space-x-2"
              >
                {state.isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Order History Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-tribal-dark">Order History</h3>
              </div>
              
              {state.isLoadingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tribal-red"></div>
                </div>
              ) : state.orders.length === 0 ? (
                <div className="text-center py-8 text-tribal-brown">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>No orders found</p>
                  <p className="text-sm text-gray-500 mt-1">Your order history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {state.orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white/60 backdrop-blur-sm border border-tribal-brown/20 rounded-xl p-4 hover:bg-white/80 transition duration-300 cursor-pointer"
                      onClick={() => setState(prev => ({ ...prev, selectedOrder: order, showOrderDetails: true }))}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-tribal-dark">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-tribal-brown">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-tribal-dark">{formatCurrency(order.total)}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-600">{order.items.length} item(s)</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 truncate">
                          {order.items.map(item => item.product.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Details Modal */}
            {state.showOrderDetails && state.selectedOrder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-tribal-dark">
                      Order Details #{state.selectedOrder.id.slice(-8).toUpperCase()}
                    </h3>
                    <button
                      onClick={() => setState(prev => ({ ...prev, showOrderDetails: false, selectedOrder: null }))}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">{formatDate(state.selectedOrder.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(state.selectedOrder.status)}`}>
                          {state.selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-lg text-tribal-red">{formatCurrency(state.selectedOrder.total)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-tribal-dark mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {state.selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-tribal-dark">{item.product.name}</p>
                              <p className="text-sm text-gray-600">{item.product.category}</p>
                              <p className="text-sm text-tribal-brown">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-tribal-dark">{formatCurrency(item.price)}</p>
                              <p className="text-sm text-gray-600">each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleProfileSave}
              disabled={state.isSaving}
              className="w-full bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-tribal-red-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white/20"
            >
              {state.isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}