import { cn } from "@/lib/utils";

interface RKSectionNavProps {
  sections: Array<{ id: number; label: string }>;
  currentSection: number;
  onSectionClick: (section: number) => void;
  className?: string;
}

export const RKSectionNav = ({ sections, currentSection, onSectionClick, className }: RKSectionNavProps) => {
  return (
    <div className={cn("bg-white rounded-2xl p-3 shadow-sm", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => {
          const isActive = section.id === currentSection;
          const isCompleted = section.id < currentSection;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-rk-primary text-white shadow-sm"
                  : isCompleted
                    ? "bg-rk-primary-light text-rk-primary hover:bg-rk-primary/20"
                    : "bg-transparent text-rk-text-light hover:bg-rk-gray-100"
              )}
            >
              <span className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all",
                isActive
                  ? "bg-white/20 border-white/30 text-white"
                  : isCompleted
                    ? "bg-rk-primary text-white border-rk-primary"
                    : "bg-white border-rk-gray-300 text-rk-text-light"
              )}>
                {section.id}
              </span>
              <span className="hidden lg:inline whitespace-nowrap">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
