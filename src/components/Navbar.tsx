"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  profileComplete: boolean;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    checkUserAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const checkUserAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking auth - Token exists:', !!token);
      
      if (!token) {
        console.log('No token found, user not logged in');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Auth check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth check response data:', data);
        
        if (data.success) {
          console.log('User authenticated:', data.data);
          setUser(data.data);
        } else {
          console.log('Auth check failed - no success flag');
        }
      } else {
        console.log('Auth check failed - response not ok');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowProfileDropdown(false);
    window.location.href = '/';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };
  return (
    <header className="sticky top-0 z-50 bg-tribal-striped text-white px-2 sm:px-4 md:px-6 flex justify-between items-center shadow-xl relative min-h-[70px]">
      {/* Left Logo */}
      <div className="flex items-center">
        <h1 className="relative bottom-2 text-3xl sm:text-4xl md:text-5xl font-normal tracking-wider drop-shadow-md font-kiner text-black" style={{ transform: 'scale(1.15)', transformOrigin: 'bottom' }}>
          <span className="double-underline">K</span>
          <span className="double-underline">i</span>n
          <span className="double-underline">i</span>r
          <span 
            className="absolute text-black"
            style={{ top: '111%', right: '5%', fontSize: '0.379535625rem', whiteSpace: 'nowrap', fontFamily: '"Monotype Corsiva", cursive', letterSpacing: '-0.05em', transform: 'translateY(-50%)' }}
          >
            .... Anything Tribal
          </span>
        </h1>
      </div>

      {/* Right Navigation */}
      <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 font-semibold">
        <Link href="/" className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg">
          <Image src="/home.svg" alt="Home" width={20} height={20} className="sm:w-6 sm:h-6" />
        </Link>
        
        {/* Cart Icon with Item Count */}
        <Link
          href="/cart"
          className="relative hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
          title="Shopping Cart"
        >
          <div className="relative">
            <Image src="/shop.svg" alt="Cart" width={20} height={20} className="sm:w-6 sm:h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-tribal-red text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse border border-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
        </Link>
        <Link
          href="/about"
          className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
          prefetch={false}
        >
          <Image src="/about.svg" alt="About" width={20} height={20} className="sm:w-6 sm:h-6" />
        </Link>
        <Link
          href="/contact"
          className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
          prefetch={false}
        >
          <Image src="/contact.svg" alt="Contact" width={20} height={20} className="sm:w-6 sm:h-6" />
        </Link>
        
        {/* Profile Section */}
        <div className="relative ml-1 sm:ml-2 md:ml-4" ref={dropdownRef}>
          
          {isLoading ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-md animate-pulse border-2 border-white shadow-lg"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 bg-white/15 backdrop-blur-md hover:bg-white/25 p-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 border-2 border-white/40 shadow-lg"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white/50 shadow-md"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-tribal-red to-tribal-red-accent flex items-center justify-center text-white text-[10px] sm:text-xs font-bold border-2 border-white/50 shadow-md">
                    {getInitials(user.firstName, user.lastName) || 'U'}
                  </div>
                )}
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tribal-red to-tribal-red-accent flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(user.firstName, user.lastName) || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Edit Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 transition duration-300 rounded-full border-2 border-white/50 shadow-lg"
              title="Sign In"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
