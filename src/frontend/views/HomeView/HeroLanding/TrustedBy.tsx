"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  SiVercel, SiNetflix, SiStripe, SiSpotify, SiTwitch, SiUber
} from "react-icons/si";

const companies = [
  { name: "Vercel", icon: SiVercel },
  { name: "Netflix", icon: SiNetflix },
  { name: "Stripe", icon: SiStripe },
  { name: "Spotify", icon: SiSpotify },
  { name: "Twitch", icon: SiTwitch },
  { name: "Uber", icon: SiUber },
];

export const TrustedBy = () => {
  return (
    <section className="w-full border-b border-white/5 bg-[#050505] py-12">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 text-center">
        <p className="mb-8 text-sm font-semibold tracking-widest text-white/40 uppercase">
          Trusted by engineering teams at
        </p>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee-trusted {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-trusted {
            animation: marquee-trusted 30s linear infinite;
          }
        `}} />
        
        <div className="relative flex w-full max-w-[100vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee-trusted items-center gap-16 pr-16 md:gap-24 md:pr-24">
            {/* Render 3 times for infinite loop */}
            {[...companies, ...companies, ...companies].map((company, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-white/30 transition-colors hover:text-white/80 grayscale hover:grayscale-0 duration-300"
              >
                <company.icon className="h-8 w-8" />
                <span className="text-xl font-bold tracking-tight">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
