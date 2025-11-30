import { cn } from "@/lib/utils";

interface DualTrafficLightIndicatorProps {
  formStatus: "compliant" | "pending" | "critical";
  dbsStatus: "compliant" | "pending" | "critical";
  className?: string;
}

const statusConfig = {
  compliant: {
    color: "bg-green-500",
    label: "Submitted",
  },
  pending: {
    color: "bg-amber-500",
    label: "Awaiting response",
  },
  critical: {
    color: "bg-red-500",
    label: "Action required",
  },
};

export const DualTrafficLightIndicator = ({
  formStatus,
  dbsStatus,
  className,
}: DualTrafficLightIndicatorProps) => {
  const formConfig = statusConfig[formStatus];
  const dbsConfig = statusConfig[dbsStatus];

  return (
    <div className={cn("flex items-center gap-4 text-sm", className)}>
      <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full flex-shrink-0", formConfig.color)} />
        <span className="text-muted-foreground">
          Form: <span className="text-foreground">{formConfig.label}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full flex-shrink-0", dbsConfig.color)} />
        <span className="text-muted-foreground">
          DBS: <span className="text-foreground">{dbsConfig.label}</span>
        </span>
      </div>
    </div>
  );
};
