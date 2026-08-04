import React, { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "indigo" | "neutral";
  pill?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "neutral",
      pill = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      danger: "bg-red-500/10 text-red-400 border-red-500/20",
      indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      neutral: "bg-gray-800 text-gray-300 border-gray-700",
    };

    const shapeStyle = pill ? "rounded-full px-3 py-1" : "rounded-lg px-2.5 py-0.5";

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 text-xs font-medium border ${shapeStyle} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
