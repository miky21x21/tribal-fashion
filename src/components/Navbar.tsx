"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
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

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  // Extract user info from NextAuth session
  const getUserFromSession = (): User | null => {
    if (!session?.user) return null;
    
    const nameParts = session.user.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return {
      id: session.user.email || 'unknown',
      email: session.user.email || '',
      firstName,
      lastName,
      avatar: session.user.image || '',
      phoneNumber: '',
      profileComplete: !!session.user.name
    };
  };

  const user = getUserFromSession();
  const isLoading = !mounted || status === 'loading';

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-tribal-striped text-white px-2 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-xl relative min-h-[77px]">
        {/* Left Logo */}
        <div className="flex items-center pl-4 sm:pl-6 md:pl-8">
          <Link href="/" className="hover:opacity-80 transition duration-300">
            <h1 
              className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider drop-shadow-md font-kiner text-black cursor-pointer kinir-logo" 
            >
              <span className="double-underline">K</span>
              <span className="double-underline">i</span>n
              <span className="double-underline">i</span>r
              <span 
                className="absolute text-black subtitle"
                style={{ 
                  top: '111%', 
                  right: '5%', 
                  fontSize: '0.454645726rem',
                  whiteSpace: 'nowrap', 
                  fontFamily: '"Monotype Corsiva", cursive', 
                  letterSpacing: '-0.05em', 
                  transform: 'translateY(-50%)'
                }}
              >
                <span className="dots-typewriter"></span>Anything Tribal
              </span>
            </h1>
          </Link>
        </div>

        {/* Right Navigation - Loading State */}
        <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 font-semibold">
          <Link href="/" className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg">
            <Image src="/home.svg" alt="Home" width={22} height={22} className="sm:w-7 sm:h-7" />
          </Link>
          
          <Link
            href="/cart"
            className="relative hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
            title="Shopping Cart"
          >
            <div className="relative">
              <Image src="/shop.svg" alt="Cart" width={22} height={22} className="sm:w-7 sm:h-7" />
            </div>
          </Link>
          
          <Link
            href="/about"
            className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
            prefetch={false}
          >
            <Image src="/about.svg" alt="About" width={22} height={22} className="sm:w-7 sm:h-7" />
          </Link>
          
          <Link
            href="/contact"
            className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
            prefetch={false}
          >
            <Image src="/contact.svg" alt="Contact" width={22} height={22} className="sm:w-7 sm:h-7" />
          </Link>
          
          {/* Loading Profile Placeholder */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/30 backdrop-blur-md animate-pulse border-2 border-white shadow-lg"></div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-tribal-striped text-white px-2 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-xl relative min-h-[77px]">
      {/* Left Logo */}
      <div className="flex items-center pl-4 sm:pl-6 md:pl-8">
        <Link href="/" className="hover:opacity-80 transition duration-300">
          <h1 
            className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider drop-shadow-md font-kiner text-black cursor-pointer kinir-logo" 
          >
            <span className="double-underline">K</span>
            <span className="double-underline">i</span>n
            <span className="double-underline">i</span>r
            <span 
              className="absolute text-black subtitle"
              style={{ 
                top: '111%', 
                right: '5%', 
                fontSize: '0.454645726rem',
                whiteSpace: 'nowrap', 
                fontFamily: '"Monotype Corsiva", cursive', 
                letterSpacing: '-0.05em', 
                transform: 'translateY(-50%)'
              }}
            >
              <span className="dots-typewriter"></span>Anything Tribal
            </span>
          </h1>
        </Link>
      </div>

      {/* Right Navigation */}
      <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 font-semibold">
        <Link href="/" className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg">
          <Image src="/home.svg" alt="Home" width={22} height={22} className="sm:w-7 sm:h-7" />
        </Link>
        
        {/* Cart Icon with Item Count */}
        <Link
          href="/cart"
          className="relative hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
          title="Shopping Cart"
        >
          <div className="relative">
            <Image src="/shop.svg" alt="Cart" width={22} height={22} className="sm:w-7 sm:h-7" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-tribal-red text-white text-[11px] sm:text-sm font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse border border-white">
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
          <Image src="/about.svg" alt="About" width={22} height={22} className="sm:w-7 sm:h-7" />
        </Link>
        <Link
          href="/contact"
          className="hover:text-amber-300 transition duration-300 p-1 sm:p-2 rounded-lg"
          prefetch={false}
        >
          <Image src="/contact.svg" alt="Contact" width={22} height={22} className="sm:w-7 sm:h-7" />
        </Link>
        
        {/* Profile Section */}
        <div className="relative ml-1 sm:ml-2 md:ml-4 z-[9999]" ref={dropdownRef}>
          
          {isLoading ? (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/30 backdrop-blur-md animate-pulse border-2 border-white shadow-lg"></div>
          ) : user ? (
            <div className="relative z-[9999]" style={{ position: 'relative', zIndex: 9999 }}>
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/50 shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-tribal-red to-tribal-red-accent flex items-center justify-center text-white text-[11px] sm:text-sm font-bold border-2 border-white/50 shadow-md">
                    {getInitials(user.firstName, user.lastName) || 'U'}
                  </div>
                )}
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999]" style={{position: 'fixed', top: '77px', right: '20px', zIndex: 99999}}>
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
              className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-md hover:bg-white/30 transition duration-300 rounded-full border-2 border-white/50 shadow-lg"
              title="Sign In"
            >
              <svg className="w-4 h-4 sm:w-7 sm:h-7 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
