import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface RKTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const RKTextarea = forwardRef<HTMLTextAreaElement, RKTextareaProps>(
  ({ label, hint, error, required, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rk-text">
          {label}
          {required && <span className="text-rk-error ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-rk-text-light">{hint}</span>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-card border-2 border-rk-border rounded-xl text-base text-rk-text placeholder:text-rk-text-light transition-all duration-200 resize-y min-h-[100px]",
            "hover:border-rk-primary/50 focus:outline-none focus:border-rk-primary focus:ring-2 focus:ring-rk-primary/20",
            error && "border-rk-error focus:border-rk-error focus:ring-rk-error/20",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {error && (
          <p className="text-sm text-rk-error mt-1">{error}</p>
        )}
      </div>
    );
  }
);

RKTextarea.displayName = "RKTextarea";
