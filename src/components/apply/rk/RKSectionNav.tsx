import { cn } from "@/lib/utils";

interface RKSectionNavProps {
  sections: Array<{ id: number; label: string }>;
  currentSection: number;
  onSectionClick: (section: number) => void;
  className?: string;
}

export const RKSectionNav = ({ sections, currentSection, onSectionClick, className }: RKSectionNavProps) => {
  return (
    <div className={cn("bg-card rounded-2xl p-2 shadow-sm", className)}>
      <div className="flex gap-1 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200",
              section.id === currentSection
                ? "bg-rk-primary text-white shadow-sm"
                : section.id < currentSection
                  ? "bg-rk-primary-light text-rk-primary hover:bg-rk-primary/20"
                  : "bg-transparent text-rk-text-light hover:bg-rk-bg-form"
            )}
            title={section.label}
          >
            {section.id}
          </button>
        ))}
      </div>
    </div>
  );
};
