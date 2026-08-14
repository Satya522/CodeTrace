import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "danger";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  active?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "secondary", active, className = "", disabled, ...props }, ref) => {
    let baseStyles =
      "relative flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:pointer-events-none";

    let variantStyles = "";

    switch (variant) {
      case "primary":
        variantStyles =
          "bg-accentBlue text-white hover:bg-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-transparent";
        break;
      case "secondary":
        variantStyles =
          "bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 hover:text-white";
        if (active) {
          variantStyles += " bg-white/15 text-white border-white/20 shadow-sm";
        }
        break;
      case "danger":
        variantStyles =
          "bg-accentRed/10 text-accentRed border border-accentRed/30 hover:bg-accentRed/20";
        break;
      case "ghost":
        variantStyles = "text-white/60 hover:text-white hover:bg-white/5 border border-transparent";
        if (active) {
          variantStyles += " text-white bg-white/10";
        }
        break;
      case "icon":
        baseStyles = baseStyles.replace("px-4 py-1.5", "p-1.5");
        variantStyles = "text-white/60 hover:text-white hover:bg-white/10 rounded-md";
        break;
    }

    if (variant !== "icon") {
      baseStyles += " px-4 py-1.5";
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.97 } : undefined}
        className={`${baseStyles} ${variantStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
