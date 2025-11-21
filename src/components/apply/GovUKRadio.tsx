import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface GovUKRadioOption {
  value: string;
  label: string;
}

export interface GovUKRadioProps {
  legend: string;
  hint?: string;
  options: GovUKRadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  name: string;
}

export const GovUKRadio = forwardRef<HTMLFieldSetElement, GovUKRadioProps>(
  ({ legend, hint, options, value, onChange, error, required, name }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn(
          "border-none p-0 mb-6",
          error && "border-l-[5px] border-[hsl(var(--govuk-red))] pl-4 py-2"
        )}
      >
        <legend className="text-lg font-bold mb-2 text-foreground">
          {legend}
          {required && <span className="text-[hsl(var(--govuk-red))] font-bold ml-1">*</span>}
        </legend>
        {hint && (
          <span className="block text-sm text-[hsl(var(--govuk-text-secondary))] mb-2">{hint}</span>
        )}
        {error && (
          <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm mb-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="mt-2 space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center relative pl-10">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute left-0 top-0 w-6 h-6 cursor-pointer appearance-none border-2 border-[hsl(var(--govuk-black))] rounded-full checked:before:content-[''] checked:before:block checked:before:w-3 checked:before:h-3 checked:before:bg-[hsl(var(--govuk-black))] checked:before:rounded-full checked:before:m-[0.25rem] focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0"
                aria-invalid={error ? "true" : "false"}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="text-base cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
);

GovUKRadio.displayName = "GovUKRadio";
