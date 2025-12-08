import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface RKSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const RKSelect = forwardRef<HTMLSelectElement, RKSelectProps>(
  ({ label, hint, error, required, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rk-text">
          {label}
          {required && <span className="text-rk-error ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-rk-text-light">{hint}</span>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-card border-2 border-rk-border rounded-xl text-base text-rk-text appearance-none cursor-pointer transition-all duration-200",
              "hover:border-rk-primary/50 focus:outline-none focus:border-rk-primary focus:ring-2 focus:ring-rk-primary/20",
              error && "border-rk-error focus:border-rk-error focus:ring-rk-error/20",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rk-text-light pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-rk-error mt-1">{error}</p>
        )}
      </div>
    );
  }
);

RKSelect.displayName = "RKSelect";
