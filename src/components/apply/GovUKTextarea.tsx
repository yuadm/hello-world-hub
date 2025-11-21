import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface GovUKTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const GovUKTextarea = forwardRef<HTMLTextAreaElement, GovUKTextareaProps>(
  ({ label, hint, error, required, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", error && "border-l-[5px] border-[hsl(var(--govuk-red))] pl-4 py-2")}>
        <label className="block text-base font-bold text-foreground">
          {label}
          {required && <span className="text-[hsl(var(--govuk-red))] font-bold ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-[hsl(var(--govuk-text-secondary))]">{hint}</span>
        )}
        {error && (
          <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full border-2 border-[hsl(var(--govuk-black))] p-2 rounded-none text-base leading-normal box-border focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0 focus:shadow-[inset_0_0_0_2px_hsl(var(--govuk-black))]",
            error && "border-[hsl(var(--govuk-red))] border-[4px]",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id || label}-error` : undefined}
          {...props}
        />
      </div>
    );
  }
);

GovUKTextarea.displayName = "GovUKTextarea";
