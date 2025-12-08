import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Check } from "lucide-react";

export interface RKCheckboxProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  name: string;
}

export const RKCheckbox = forwardRef<HTMLInputElement, RKCheckboxProps>(
  ({ label, hint, checked, onChange, error, required, name }, ref) => {
    return (
      <div className="space-y-1">
        <label
          className={cn(
            "flex items-start gap-3 p-4 bg-card border-2 rounded-xl cursor-pointer transition-all duration-200",
            checked
              ? "border-rk-primary bg-rk-primary-light"
              : "border-rk-border hover:border-rk-primary/50"
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              name={name}
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only"
              aria-invalid={error ? "true" : "false"}
            />
            <div className={cn(
              "w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
              checked
                ? "border-rk-primary bg-rk-primary"
                : "border-rk-border bg-card"
            )}>
              {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-base text-rk-text">
              {label}
              {required && <span className="text-rk-error ml-1">*</span>}
            </span>
            {hint && (
              <span className="block text-sm text-rk-text-light mt-1">{hint}</span>
            )}
          </div>
        </label>
        {error && (
          <p className="text-sm text-rk-error">{error}</p>
        )}
      </div>
    );
  }
);

RKCheckbox.displayName = "RKCheckbox";
