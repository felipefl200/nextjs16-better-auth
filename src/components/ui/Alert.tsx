import React, { HTMLAttributes } from "react";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "danger" | "warning" | "success" | "info";
  title?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { children, variant = "danger", title, className = "", ...props },
    ref,
  ) => {
    const variantStyles = {
      danger: "bg-red-500/10 border-red-500/50 text-red-400",
      warning: "bg-amber-500/10 border-amber-500/50 text-amber-300",
      success: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400",
      info: "bg-indigo-500/10 border-indigo-500/50 text-indigo-300",
    };

    const titleColors = {
      danger: "text-red-400",
      warning: "text-amber-400",
      success: "text-emerald-400",
      info: "text-indigo-400",
    };

    return (
      <div
        ref={ref}
        className={`p-4 rounded-xl border text-sm ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {title && (
          <div
            className={`font-semibold mb-1 flex items-center gap-2 ${titleColors[variant]}`}
          >
            {variant === "warning" && (
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {title}
          </div>
        )}
        {children}
      </div>
    );
  },
);

Alert.displayName = "Alert";
