export const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 1,
};

export const slowSpringTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

export const fadeScaleVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const slideUpVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: springTransition },
  exit: { opacity: 0, y: -15, transition: { duration: 0.15 } },
};

export const itemStaggerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const pulseGlowVariant = {
  idle: { boxShadow: "0 0 0px rgba(59,130,246,0)" },
  pulse: {
    boxShadow: "0 0 15px rgba(59,130,246,0.6)",
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 0.8,
    },
  },
};
