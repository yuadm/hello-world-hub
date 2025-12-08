import { cn } from "@/lib/utils";

interface RKFormHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const RKFormHeader = ({ title, subtitle, className }: RKFormHeaderProps) => {
  return (
    <div className={cn("rk-form-header", className)}>
      <h1 className="text-2xl md:text-3xl font-bold text-white font-fraunces mb-2 opacity-95">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-white/85">{subtitle}</p>
      )}
    </div>
  );
};
