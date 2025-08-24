"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import theme from "./theme.jpg";

const DESIGN_WIDTH = 896; // lock layout to this design width and scale down on smaller screens

function Hero() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const next = Math.min(1, window.innerWidth / DESIGN_WIDTH);
      setScale(next);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-tribal-brown text-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={theme}
          alt="Tribal background"
          fill
          quality={100}
          className="opacity-50 brown-filter object-cover"
        />
      </div>

      {/* Scaler wrapper keeps visual alignment locked and scales content instead of reflowing */}
      <div className="relative z-10 w-full flex justify-center">
        <div
          className="origin-top"
          style={{
            width: `${DESIGN_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-bold mb-6 font-kiner leading-tight text-shadow-book"
            style={{ fontSize: "120%" }}
          ></motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 2 }}
            transition={{ delay: 0.5, duration: 2 }}
            className="text-tribal-brown text-left lg:text-base mb-8 mx-auto leading-relaxed text-shadow-book"
            style={{ fontFamily: "'Homemade Apple', cursive", fontSize: "150%", color: "#8B4513" }}
          >
            &#160;&#160;&#160;&#160;&#160;&#160;In the age of mass production, the handmade stands out tall,
            
            distinctly representing a vibrant, dynamic living tradition.
            <br />
            <br />
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;The handmade are not just relics of the past.
            <br />
            <br />
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Jharkhand once boasted a self-sustained textile cottage industry when
            
            the weavers excelled in transforming the ordinary,
            
            giving the loom its poetic tradition.
            <br />
            <br />
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Today with homegrown cotton and vegetable dyes of Jharkhand having
            
            faded with the background, into history,
            
            all that is left is the art form and the skill that clings on and
            
            refuses to die.
            <br /><br />
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;This is what you hold in your hands.
            <br />
            
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;<span className="whitespace-nowrap">Kinir... anything tribal</span>
</motion.p>

          <motion.div
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >

            <a
              href="/shop"

              className="px-6 py-3 rounded-full bg-tribal-red text-white hover:bg-tribal-green transition duration-200 shadow-xl inline-block font-semibold"
           >
              Explore Collection
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
