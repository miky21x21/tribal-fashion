"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-tribal-striped text-white px-4 sm:px-6 flex justify-between items-center shadow-xl relative">
      {/* Left Logo */}
      <div className="flex items-center">
        <h1 className="relative bottom-2 text-4xl sm:text-5xl font-normal tracking-wider drop-shadow-md font-kiner text-black" style={{ transform: 'scale(1.15)', transformOrigin: 'bottom' }}>
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
      <nav className="flex space-x-10 font-semibold">
        <Link href="/" className="hover:text-amber-300 transition duration-300">
          <Image src="/home.svg" alt="Home" width={24} height={24} />
        </Link>
        <Link
          href="/shop"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          <Image src="/shop.svg" alt="Shop" width={24} height={24} />
        </Link>
        <Link
          href="/about"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          <Image src="/about.svg" alt="About" width={24} height={24} />
        </Link>
        <Link
          href="/contact"
          className="hover:text-amber-300 transition duration-300"
          prefetch={false}
        >
          <Image src="/contact.svg" alt="Contact" width={24} height={24} />
        </Link>
      </nav>
    </header>
  );
}
