"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-tribal-striped text-white px-4 sm:px-6 flex justify-between items-center shadow-xl relative">
      {/* Left Logo */}
      <div className="flex items-center space-x-2">
        <h1 className="relative bottom-2 text-4xl sm:text-5xl font-normal tracking-wide drop-shadow-md font-kiner text-black">
          <span className="double-underline">K</span>
          <span className="double-underline">i</span>n
          <span className="double-underline">i</span>r
        </h1>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex flex-col justify-center items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span
          className={`bg-tribal-cream block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-tribal-cream block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isMenuOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-tribal-cream block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:space-x-10 font-semibold">
        <Link href="/" className="hover:text-amber-300 transition duration-300">
          Home
        </Link>
        <Link
          href="/shop"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          Shop
        </Link>
        <Link
          href="/about"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          Contact
        </Link>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-tribal-dark text-white py-4 px-6 shadow-xl absolute top-[70px] left-0 right-0">
          <div className="flex flex-col space-y-4 text-center font-semibold">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
