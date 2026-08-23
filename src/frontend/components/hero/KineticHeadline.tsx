"use client";

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type SegmentStyle = {
  rotate: number;
  y: number;
  scale?: number;
  entryRotate?: number;
  color?: string;
};

type KineticWord = {
  id: string;
  text: string;
  split?: boolean;
  style: SegmentStyle;
  letters?: SegmentStyle[];
};

type KineticLine = {
  id: string;
  words: KineticWord[];
};

type ResolvedStyle = Required<Pick<SegmentStyle, 'rotate' | 'y' | 'scale' | 'entryRotate'>> & {
  color?: string;
};

const textSpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 25,
  mass: 0.75,
};

const lines: KineticLine[] = [
  {
    id: 'where-logic',
    words: [
      {
        id: 'where',
        text: 'Where',
        style: { rotate: -1.5, y: 1, scale: 1.02, entryRotate: -8 },
      },
      {
        id: 'logic',
        text: 'Logic',
        split: false,
        style: { rotate: 1.1, y: -2, scale: 1, entryRotate: 7 },
      },
    ],
  },
  {
    id: 'becomes-visible',
    words: [
      {
        id: 'becomes',
        text: 'Becomes',
        style: { rotate: 1.4, y: 0, scale: 0.98, entryRotate: 8 },
      },
      {
        id: 'visible',
        text: 'Visible.',
        split: true,
        style: { rotate: -0.8, y: 2, scale: 1.01, entryRotate: -6 },
        letters: [
          { rotate: 2.2, y: -1, color: '#22d3ee' },
          { rotate: -3.6, y: 3 },
          { rotate: 2.8, y: -4, scale: 1.04 },
          { rotate: -1.4, y: 1, color: '#3b82f6' },
          { rotate: 3.4, y: -2 },
          { rotate: -2, y: 2 },
          { rotate: 1.7, y: -1, color: '#fbbf24' },
          { rotate: -5, y: 3, scale: 0.94 },
        ],
      },
    ],
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { delayChildren: 0 }
      : {
          staggerChildren: 0.075,
          delayChildren: 0.12,
        },
  }),
};

const lineVariants: Variants = {
  hidden: {},
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { delayChildren: 0 }
      : {
          staggerChildren: 0.055,
        },
  }),
};

const wordContainerVariants: Variants = {
  hidden: {},
  visible: (reduced: boolean) => ({
    transition: reduced
      ? { delayChildren: 0 }
      : {
          staggerChildren: 0.035,
        },
  }),
};

const segmentVariants: Variants = {
  hidden: (style: ResolvedStyle) => ({
    opacity: 0,
    y: style.y + 34,
    scale: 0.86,
    rotate: style.rotate + style.entryRotate,
    filter: 'blur(6px)',
  }),
  visible: (style: ResolvedStyle) => ({
    opacity: 1,
    y: style.y,
    scale: style.scale,
    rotate: style.rotate,
    filter: 'blur(0px)',
    transition: textSpring,
  }),
};

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const update = () => setIsCompact(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isCompact;
}

function resolveStyle(style: SegmentStyle, motionScale: number, yScale: number): ResolvedStyle {
  return {
    rotate: style.rotate * motionScale,
    y: style.y * yScale,
    scale: style.scale ?? 1,
    entryRotate: (style.entryRotate ?? style.rotate * 2) * motionScale,
    color: style.color,
  };
}

function KineticWord({ word, motionScale, yScale, reduced }: {
  word: KineticWord;
  motionScale: number;
  yScale: number;
  reduced: boolean;
}) {
  const wordStyle = resolveStyle(word.style, motionScale, yScale);
  const hoverMotion = reduced
    ? undefined
    : {
        y: wordStyle.y - 3,
        rotate: wordStyle.rotate * 0.45,
        transition: { type: 'spring' as const, stiffness: 360, damping: 20 },
      };

  if (!word.split) {
    return (
      <motion.span
        custom={wordStyle}
        variants={segmentVariants}
        whileHover={hoverMotion}
        className="inline-block whitespace-nowrap text-white"
      >
        {word.text}
      </motion.span>
    );
  }

  return (
    <motion.span
      custom={reduced}
      variants={wordContainerVariants}
      whileHover={hoverMotion}
      className="inline-flex whitespace-nowrap text-white"
      style={{ rotate: wordStyle.rotate, y: wordStyle.y, scale: wordStyle.scale }}
    >
      {Array.from(word.text).map((letter, index) => {
        const letterStyle = resolveStyle(word.letters?.[index] ?? { rotate: 0, y: 0 }, motionScale, yScale);

        return (
          <motion.span
            key={`${word.id}-${letter}-${index}`}
            custom={letterStyle}
            variants={segmentVariants}
            className="inline-block"
            style={{
              color: letterStyle.color ?? 'white',
              marginRight: index === word.text.length - 1 ? 0 : '-0.065em',
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

function FloatingDoodles({ reduced }: { reduced: boolean }) {
  const float = (delay: number, distance = 8) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -distance, 0], x: [0, distance * 0.6, 0], rotate: [-2, 2, -2] },
          transition: {
            duration: 3.8 + delay,
            delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.span
        {...float(0.2, 8)}
        className="absolute left-4 top-2 sm:left-8 lg:left-16 hidden rotate-[-6deg] rounded-md border border-cyan-400/50 bg-cyan-400/10 px-2.5 py-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-cyan-200 shadow-[0_8px_24px_rgba(34,211,238,0.16)] sm:inline-flex"
      >
        O(N)
      </motion.span>

      <motion.span
        {...float(0.75, 7)}
        className="absolute right-4 top-8 sm:right-8 lg:right-16 hidden h-8 w-8 rotate-6 items-center justify-center rounded-full border border-amber-400/45 bg-amber-400/10 text-lg font-black text-amber-400 shadow-[0_8px_22px_rgba(251,191,36,0.14)] md:flex"
      >
        {"{ }"}
      </motion.span>

      <motion.span
        {...float(1.1, 8)}
        className="absolute -left-2 top-[55%] sm:left-0 lg:left-4 hidden rotate-[-4deg] rounded-full border border-blue-400/45 bg-blue-400/10 px-3 py-1.5 font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-blue-200 shadow-[0_8px_24px_rgba(59,130,246,0.12)] md:inline-flex"
      >
        0ms
      </motion.span>

      <span className="absolute left-[30%] sm:left-[35%] lg:left-[40%] top-2 hidden h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.34)] sm:block" />
      <span className="absolute bottom-[10%] right-[30%] sm:right-[35%] lg:right-[40%] h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.32)]" />
    </div>
  );
}

export default function KineticHeadline() {
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useCompactViewport();
  const reduced = Boolean(prefersReducedMotion);
  const motionScale = reduced ? 0 : isCompact ? 0.55 : 1;
  const yScale = reduced ? 0 : isCompact ? 0.55 : 1;

  return (
    <div className="relative mx-auto w-full max-w-[1180px] overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative mx-auto w-full">
        <FloatingDoodles reduced={reduced} />
        <motion.h1
          aria-label="Where Logic Becomes Visible."
          custom={reduced}
          variants={containerVariants}
          initial={reduced ? 'visible' : 'hidden'}
          animate="visible"
          className="relative z-10 mx-auto max-w-full select-none text-center text-[clamp(2.35rem,12vw,4.5rem)] font-black leading-[0.9] tracking-normal text-white sm:text-[clamp(4rem,8vw,6.5rem)] sm:leading-[0.84]"
          style={{
            fontFamily: "var(--user-font-family, 'Inter'), ui-sans-serif, system-ui, sans-serif",
            textWrap: 'balance',
          }}
        >
          <span aria-hidden="true" className="block">
            {lines.map((line) => (
              <motion.span
                key={line.id}
                custom={reduced}
                variants={lineVariants}
                className="relative flex flex-nowrap justify-center gap-[0.24em] sm:gap-[0.22em]"
              >
                {line.words.map((word) => (
                  <KineticWord
                    key={word.id}
                    word={word}
                    motionScale={motionScale}
                    yScale={yScale}
                    reduced={reduced}
                  />
                ))}
              </motion.span>
            ))}
          </span>
        </motion.h1>
      </div>
    </div>
  );
}
