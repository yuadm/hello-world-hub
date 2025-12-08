import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface RKRadioOption {
  value: string;
  label: string;
  hint?: string;
}

export interface RKRadioProps {
  legend: string;
  hint?: string;
  options: RKRadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  name: string;
  inline?: boolean;
}

export const RKRadio = forwardRef<HTMLFieldSetElement, RKRadioProps>(
  ({ legend, hint, options, value, onChange, error, required, name, inline = true }, ref) => {
    return (
      <fieldset ref={ref} className="border-none p-0">
        <legend className="block text-sm font-medium text-rk-text mb-1.5">
          {legend}
          {required && <span className="text-rk-error ml-1">*</span>}
        </legend>
        {hint && (
          <span className="block text-sm text-rk-text-light mb-3">{hint}</span>
        )}
        <div className={cn("flex gap-6", inline ? "flex-row flex-wrap" : "flex-col gap-3")}>
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                  aria-invalid={error ? "true" : "false"}
                />
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                  value === option.value
                    ? "border-rk-primary bg-white"
                    : "border-rk-gray-400 bg-white group-hover:border-rk-gray-500"
                )}>
                  {value === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-rk-primary" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-base text-rk-text">{option.label}</span>
                {option.hint && (
                  <span className="block text-sm text-rk-text-light">{option.hint}</span>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="text-sm text-rk-error mt-2">{error}</p>
        )}
      </fieldset>
    );
  }
);

RKRadio.displayName = "RKRadio";
