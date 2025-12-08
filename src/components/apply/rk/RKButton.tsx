import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface RKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const RKButton = forwardRef<HTMLButtonElement, RKButtonProps>(
  ({ variant = "primary", size = "md", className, children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-rk-primary text-white hover:bg-rk-primary-dark focus:ring-rk-primary",
      secondary: "bg-card border-2 border-rk-border text-rk-text hover:border-rk-primary hover:bg-rk-primary-light focus:ring-rk-primary",
      ghost: "bg-transparent text-rk-primary hover:bg-rk-primary-light focus:ring-rk-primary",
      destructive: "bg-rk-error text-white hover:bg-rk-error/90 focus:ring-rk-error",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

RKButton.displayName = "RKButton";
