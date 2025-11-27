interface AssistantFormProgressBarProps {
  currentSection: number;
  totalSections: number;
}

export const AssistantFormProgressBar = ({ currentSection, totalSections }: AssistantFormProgressBarProps) => {
  const sectionTitles = [
    "Personal Details",
    "Address History",
    "Professional History",
    "Vetting & Suitability",
    "Health Declaration",
    "Declaration & Submission"
  ];

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Section {currentSection + 1} of {totalSections}
        </span>
        <span className="text-sm text-muted-foreground">
          {sectionTitles[currentSection]}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {sectionTitles.map((title, index) => (
          <div
            key={index}
            className={`text-xs ${
              index <= currentSection
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
