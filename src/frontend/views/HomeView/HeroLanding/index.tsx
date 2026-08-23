"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { Features } from "./Features";
import { Languages } from "./Languages";
import { Algorithms } from "./Algorithms";
import { TrustedBy } from "./TrustedBy";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";
import { useReducedMotion } from "framer-motion";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export interface HeroLandingProps {
  onStart: (code?: string, lang?: string) => void;
}

const NoiseOverlay = () => (
  <svg
    aria-hidden="true"
    className="fixed inset-0 z-[1] h-full w-full pointer-events-none opacity-[0.025] mix-blend-soft-light"
  >
    <filter id="lta-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#lta-noise)" />
  </svg>
);

export function HeroLanding({ onStart }: HeroLandingProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-cyan-500/30 ${inter.className}`}>
      <NoiseOverlay />

      <Navbar onStart={onStart} />

      <main className="relative z-10 flex flex-col items-center">
        <HeroSection onStart={onStart} />
        
        <TrustedBy />

        <Features />
        
        <Languages />
        
        <Algorithms onStart={onStart} />
        
        <Testimonials />
      </main>

      <Footer />

      <style jsx global>{`
        html {
          scroll-behavior: smooth !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.35) #000;
        }
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.45), rgba(59, 130, 246, 0.45));
          border-radius: 999px;
          border: 2px solid #000;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.7), rgba(59, 130, 246, 0.7));
        }
      `}</style>
    </div>
  );
}
