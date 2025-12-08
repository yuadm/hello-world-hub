import { cn } from "@/lib/utils";

interface RKProgressCardProps {
  currentSection: number;
  totalSections: number;
  className?: string;
}

export const RKProgressCard = ({ currentSection, totalSections, className }: RKProgressCardProps) => {
  const percentage = Math.round(((currentSection - 1) / totalSections) * 100);
  
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-rk-text-light uppercase tracking-wider">Progress</span>
        <span className="text-3xl font-bold text-rk-primary font-fraunces">{percentage}%</span>
      </div>
      <p className="text-sm text-rk-text mb-4">Section {currentSection} of {totalSections}</p>
      <div className="h-2 bg-rk-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rk-primary to-rk-primary-glow rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
