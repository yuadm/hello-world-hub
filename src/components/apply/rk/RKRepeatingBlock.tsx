import { cn } from "@/lib/utils";
import { RKButton } from "./RKButton";
import { Plus, Trash2 } from "lucide-react";

interface RKRepeatingBlockProps {
  title: string;
  items: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  addLabel: string;
  renderItem: (index: number) => React.ReactNode;
  className?: string;
  maxItems?: number;
  disabled?: boolean;
  disabledMessage?: string;
}

export const RKRepeatingBlock = ({
  title,
  items,
  onAdd,
  onRemove,
  addLabel,
  renderItem,
  className,
  maxItems,
  disabled,
  disabledMessage,
}: RKRepeatingBlockProps) => {
  const canAdd = !disabled && (!maxItems || items.length < maxItems);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((_, index) => (
        <div
          key={index}
          className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-rk-text">{title} {index + 1}</h4>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex items-center gap-1.5 text-sm text-rk-error hover:text-rk-error/80 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
          {renderItem(index)}
        </div>
      ))}
      
      <RKButton
        type="button"
        variant="secondary"
        onClick={onAdd}
        disabled={!canAdd}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {disabled ? (disabledMessage || addLabel) : addLabel}
      </RKButton>
    </div>
  );
};
