"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  profileComplete: boolean;
}

// Create a static version that matches exactly what the server renders
const StaticNavbar = () => (
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

    {/* Right Navigation - Static State */}
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
      
      {/* Static Profile Placeholder */}
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/30 backdrop-blur-md border-2 border-white shadow-lg"></div>
    </nav>
  </header>
);

// Main Navbar component with hydration protection
const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the static version first to prevent hydration mismatch
  if (!mounted) {
    return <StaticNavbar />;
  }

  // After hydration, render the authenticated version using dynamic import
  const AuthenticatedNavbar = dynamic(() => import('./AuthenticatedNavbar'), {
    ssr: false,
    loading: () => <StaticNavbar />
  });

  return <AuthenticatedNavbar />;
};

export default Navbar;
