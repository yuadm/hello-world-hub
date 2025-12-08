import { cn } from "@/lib/utils";

interface RKFormHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const RKFormHeader = ({ title, subtitle, className }: RKFormHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl md:text-4xl font-bold text-rk-secondary font-fraunces mb-2 opacity-60">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-rk-text-light">{subtitle}</p>
      )}
    </div>
  );
};
