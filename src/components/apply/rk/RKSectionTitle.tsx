import { cn } from "@/lib/utils";

interface RKSectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export const RKSectionTitle = ({ title, subtitle, description, className }: RKSectionTitleProps) => {
  const descText = description || subtitle;
  
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-2xl font-bold text-rk-secondary font-fraunces">{title}</h2>
      {descText && (
        <p className="text-base text-rk-text-light mt-2">{descText}</p>
      )}
    </div>
  );
};
