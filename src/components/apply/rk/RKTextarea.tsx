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
            "w-full px-4 py-3 bg-white border-2 border-rk-gray-300 rounded-xl text-base text-rk-text placeholder:text-rk-text-light transition-all duration-200 resize-y min-h-[120px]",
            "hover:border-rk-gray-400 focus:outline-none focus:border-rk-primary focus:shadow-[0_0_0_3px_hsl(163_50%_38%/0.15)]",
            error && "border-rk-error bg-red-50 focus:border-rk-error focus:shadow-[0_0_0_3px_hsl(0_72%_55%/0.15)]",
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
