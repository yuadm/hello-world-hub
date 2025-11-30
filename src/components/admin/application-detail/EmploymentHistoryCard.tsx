import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Briefcase, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface EmploymentHistoryCardProps {
  employmentHistory?: any[];
  employmentGaps?: string;
  currentEmployment?: string;
}

export const EmploymentHistoryCard = ({
  employmentHistory,
  employmentGaps,
  currentEmployment,
}: EmploymentHistoryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasGaps = !!employmentGaps;

  return (
    <AppleCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">Employment History</h3>
      </div>
      
      <div className="space-y-4">
        {currentEmployment && (
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">Current Employment</div>
            <div className="text-sm font-medium">{currentEmployment}</div>
          </div>
        )}

        {hasGaps && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Employment Gaps Identified
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-200">
                  {employmentGaps}
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasGaps && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-900 dark:text-green-100">
                Complete Employment History
              </span>
            </div>
          </div>
        )}

        {employmentHistory && employmentHistory.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">View Full History ({employmentHistory.length})</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {employmentHistory.map((job: any, idx: number) => (
                <div key={idx} className="rounded-lg bg-muted/20 p-3">
                  <div className="font-medium text-sm">{job.employer}</div>
                  <div className="text-sm text-muted-foreground">{job.role}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{job.startDate} - {job.endDate}</span>
                  </div>
                  {job.reasonForLeaving && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Reason: {job.reasonForLeaving}
                    </div>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </AppleCard>
  );
};
