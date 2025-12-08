import { cn } from "@/lib/utils";

interface RKSectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const RKSectionTitle = ({ title, subtitle, className }: RKSectionTitleProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-2xl font-bold text-rk-secondary font-fraunces">{title}</h2>
      {subtitle && (
        <p className="text-base text-rk-text-light mt-2">{subtitle}</p>
      )}
    </div>
  );
};
