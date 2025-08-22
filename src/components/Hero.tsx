"use client";

import { motion } from "framer-motion";
import { memo } from "react";

function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-tribal-gradient-warm text-tribal-brown text-center px-4 sm:px-6 md:px-20 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-kiner leading-tight"
        >
          Kinir... anything tribal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          In the age of mass production, the handmade stands out tall,
          distinctly representing a vibrant, dynamic living tradition. The
          handmade are not just relics of the past. Jharkhand once boasted a
          self-sustained textile cottage industry when the weavers excelled in
          transforming the ordinary, giving the loom its poetic tradition. Today
          with homegrown cotton and vegetable dyes of Jharkhand having faded
          with the background, into history, all that is left is the art form
          and the skill that clings on and refuses to die. This is what you hold
          in your hands. Kinir... anything tribal
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="/shop"
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-tribal-red text-white hover:bg-tribal-green transition duration-300 shadow-xl inline-block text-base sm:text-lg font-semibold"
          >
            Explore Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Hero);
