interface FormProgressBarProps {
  currentSection: number;
  totalSections: number;
}

export function FormProgressBar({ currentSection, totalSections }: FormProgressBarProps) {
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">
          Section {currentSection + 1} of {totalSections}
        </span>
        <span className="text-sm font-semibold">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
