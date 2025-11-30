import { cn } from "@/lib/utils";

interface TrafficLightIndicatorProps {
  status: "compliant" | "pending" | "critical" | "not_applicable";
  className?: string;
}

export const TrafficLightIndicator = ({ status, className }: TrafficLightIndicatorProps) => {
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full flex-shrink-0",
        status === "compliant" && "bg-green-500",
        status === "pending" && "bg-amber-500",
        status === "critical" && "bg-red-500 animate-pulse",
        status === "not_applicable" && "bg-muted",
        className
      )}
    />
  );
};
