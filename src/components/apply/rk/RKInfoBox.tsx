import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export interface RKInfoBoxProps {
  type: "info" | "warning" | "success" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const RKInfoBox = ({ type, title, children, className }: RKInfoBoxProps) => {
  const config = {
    info: {
      icon: Info,
      bgClass: "bg-blue-50",
      borderClass: "border-l-4 border-l-blue-500",
      iconClass: "text-blue-500",
      titleClass: "text-blue-800",
    },
    warning: {
      icon: AlertTriangle,
      bgClass: "bg-amber-50",
      borderClass: "border-l-4 border-l-amber-500",
      iconClass: "text-amber-500",
      titleClass: "text-amber-800",
    },
    success: {
      icon: CheckCircle2,
      bgClass: "bg-emerald-50",
      borderClass: "border-l-4 border-l-emerald-500",
      iconClass: "text-emerald-500",
      titleClass: "text-emerald-800",
    },
    error: {
      icon: XCircle,
      bgClass: "bg-red-50",
      borderClass: "border-l-4 border-l-red-500",
      iconClass: "text-red-500",
      titleClass: "text-red-800",
    },
  };

  const { icon: Icon, bgClass, borderClass, iconClass, titleClass } = config[type];

  return (
    <div className={cn("flex gap-3 p-4 rounded-r-xl", bgClass, borderClass, className)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconClass)} />
      <div className="flex-1">
        {title && (
          <p className={cn("font-medium mb-1", titleClass)}>{title}</p>
        )}
        <div className="text-sm text-rk-text">{children}</div>
      </div>
    </div>
  );
};
