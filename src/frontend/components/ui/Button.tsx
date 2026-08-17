import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "danger";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  active?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "secondary", active, className = "", disabled, ...props }, ref) => {
    let baseStyles =
      "relative flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group";

    let variantStyles = "";

    switch (variant) {
      case "primary":
        variantStyles =
          "bg-accentBlue text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-accentBlue/50";
        break;
      case "secondary":
        variantStyles =
          "bg-white/5 text-white/90 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]";
        if (active) {
          variantStyles += " bg-white/20 text-white border-white/40 shadow-sm";
        }
        break;
      case "danger":
        variantStyles =
          "bg-accentRed/10 text-accentRed border border-accentRed/30 hover:bg-accentRed/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-accentRed/50";
        break;
      case "ghost":
        variantStyles = "text-white/60 hover:text-white hover:bg-white/10 border border-transparent";
        if (active) {
          variantStyles += " text-white bg-white/15";
        }
        break;
      case "icon":
        baseStyles = baseStyles.replace("px-4 py-1.5", "p-1.5");
        variantStyles = "text-white/60 hover:text-white hover:bg-white/15 rounded-full hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]";
        break;
    }

    if (variant !== "icon") {
      baseStyles += " px-4 py-1.5";
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.03 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        initial={{ opacity: 0.9 }}
        whileInView={{ opacity: 1 }}
        className={`${baseStyles} ${variantStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        {/* Subtle shine effect wrapper */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
