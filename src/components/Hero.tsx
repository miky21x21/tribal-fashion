"use client";

import { motion, useInView } from "framer-motion";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

const DESIGN_WIDTH = 896; // lock layout to this design width and scale down on smaller screens

function Hero() {
  const [scale, setScale] = useState(1);
  const [baseHeight, setBaseHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.3 });

  useLayoutEffect(() => {
    if (contentRef.current) {
      setBaseHeight(contentRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const next = Math.min(1, window.innerWidth / DESIGN_WIDTH);
      setScale(next);
    };
    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-tribal-brown text-center px-4 py-16 overflow-hidden">
      <div className="absolute z-0 hero-background-div inset-0">
        <Image
          src="/images/hero-background.jpg"
          alt="Tribal background"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Scaler wrapper keeps visual alignment locked and scales content instead of reflowing */}
      <div className="relative z-10 w-full flex justify-center">
        <div style={{ height: baseHeight ? `${baseHeight * scale}px` : "auto" }}>
          <div
            ref={contentRef}
            className="origin-top"
            style={{
              width: `${DESIGN_WIDTH}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
          
           <motion.div
             ref={textRef}
             initial={{ opacity: 0 }}
             animate={isInView ? { opacity: 1 } : { opacity: 0 }}
             transition={{ 
               duration: 1.5, 
               ease: "easeOut",
               delay: 0.2
             }}
            className="text-tribal-brown text-left lg:text-base mb-8 mx-auto leading-relaxed text-shadow-book hero-paragraph mobile-text-wrap"
            style={{ fontFamily: "'Homemade Apple', cursive", fontSize: "135%", color: "#8B4513" }}
          >
            &#160;&#160;&#160;&#160;&#160;&#160;In the age of mass production, the handmade stands out tall,
            
            distinctly  representing a vibrant, dynamic living tradition.
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
            
            &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;<span>Kinir... anything tribal</span>
          </motion.div>

        </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);