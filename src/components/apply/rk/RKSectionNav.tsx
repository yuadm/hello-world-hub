import { cn } from "@/lib/utils";

interface RKSectionNavProps {
  sections: Array<{ id: number; label: string }>;
  currentSection: number;
  onSectionClick: (section: number) => void;
  className?: string;
}

export const RKSectionNav = ({ sections, currentSection, onSectionClick, className }: RKSectionNavProps) => {
  return (
    <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
      <div className="flex items-center justify-start gap-2 md:gap-3 overflow-x-auto pb-1">
        {sections.map((section) => {
          const isActive = section.id === currentSection;
          const isCompleted = section.id < currentSection;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2",
                isActive
                  ? "bg-rk-primary text-white border-rk-primary shadow-sm"
                  : isCompleted
                    ? "bg-rk-primary-light text-rk-primary border-rk-primary-light hover:border-rk-primary"
                    : "bg-white text-rk-text-light border-rk-gray-200 hover:border-rk-gray-400"
              )}
              title={section.label}
            >
              {section.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
