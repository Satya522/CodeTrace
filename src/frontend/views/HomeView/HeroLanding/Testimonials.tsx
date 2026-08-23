"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "CodeTrace completely changed how our team debugs complex algorithms. The visualization engine is lightyears ahead of standard console logs.",
    name: "Sarah Jenkins",
    role: "Senior Staff Engineer",
    company: "Vercel",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    quote: "The ability to just drop in code and immediately see the AST and memory heap in real-time has saved us hundreds of hours.",
    name: "Michael Chen",
    role: "Engineering Manager",
    company: "Stripe",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "An absolute game-changer for our technical interviews and onboarding. Seeing how someone thinks through the visualizations is priceless.",
    name: "Elena Rodriguez",
    role: "VP of Engineering",
    company: "Netflix",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  },
  {
    quote: "We use CodeTrace daily to verify our distributed systems logic. The real-time step execution helps us catch race conditions easily.",
    name: "David Kim",
    role: "Backend Lead",
    company: "Spotify",
    image: "https://i.pravatar.cc/150?u=a04258114e29026703d"
  },
  {
    quote: "It's like having X-ray vision for your code. The UI is incredibly slick, and the fact that it runs perfectly in the browser is mind-blowing.",
    name: "Anita Patel",
    role: "Frontend Architect",
    company: "Twitch",
    image: "https://i.pravatar.cc/150?u=a04258114e29026704d"
  }
];

export const Testimonials = () => {
  return (
    <section className="relative w-full bg-black pb-24 pt-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase">
            Wall of Love
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Loved by top engineers.
          </h2>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-testimonials {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-testimonials {
          animation: marquee-testimonials 40s linear infinite;
        }
        .animate-marquee-testimonials:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="relative flex w-full max-w-[100vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee-testimonials items-stretch gap-6 px-3">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="group relative flex w-[350px] md:w-[400px] flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-white/20"
            >
              <Quote className="absolute top-6 right-6 h-6 w-6 text-white/5 transition-colors group-hover:text-blue-500/20" />
              <p className="relative z-10 mb-8 text-base font-medium leading-relaxed text-white/70">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs font-medium text-white/50">{t.role} @ {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
