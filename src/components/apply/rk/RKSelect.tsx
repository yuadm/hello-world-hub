import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface RKSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  widthClass?: "full" | "half" | "auto";
}

export const RKSelect = forwardRef<HTMLSelectElement, RKSelectProps>(
  ({ label, hint, error, required, options, widthClass = "full", className, ...props }, ref) => {
    const widthClasses = {
      full: "w-full",
      half: "w-full md:w-1/2",
      auto: "w-auto min-w-[12rem]",
    };

    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rk-text">
          {label}
          {required && <span className="text-rk-error ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-rk-text-light">{hint}</span>
        )}
        <div className={cn("relative", widthClasses[widthClass])}>
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-white border-2 border-rk-gray-300 rounded-xl text-base text-rk-text appearance-none cursor-pointer transition-all duration-200 pr-10",
              "hover:border-rk-gray-400 focus:outline-none focus:border-rk-primary focus:shadow-[0_0_0_3px_hsl(163_50%_38%/0.15)]",
              error && "border-rk-error bg-red-50 focus:border-rk-error focus:shadow-[0_0_0_3px_hsl(0_72%_55%/0.15)]",
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
