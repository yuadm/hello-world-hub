import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle } from "lucide-react";

interface DBSVettingCardProps {
  hasDBS: string;
  dbsNumber?: string;
  dbsEnhanced?: string;
  dbsUpdate?: string;
  offenceHistory: string;
  previousRegistration?: string;
  registrationDetails?: any;
  healthConditions?: string;
  healthDetails?: string;
  smoker?: string;
  disqualified?: string;
  safeguardingConcerns?: string;
  safeguardingDetails?: string;
  otherCircumstances?: string;
  otherCircumstancesDetails?: string;
  convictionsDetails?: string;
}

export const DBSVettingCard = ({
  hasDBS,
  dbsNumber,
  dbsEnhanced,
  dbsUpdate,
  offenceHistory,
  previousRegistration,
  registrationDetails,
  healthConditions,
  healthDetails,
  smoker,
  disqualified,
  safeguardingConcerns,
  safeguardingDetails,
  otherCircumstances,
  otherCircumstancesDetails,
  convictionsDetails,
}: DBSVettingCardProps) => {
  return (
    <AppleCard className="p-6 col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">Suitability & Background Checks</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            DBS Certificate
          </div>
          <Badge variant={hasDBS === "Yes" ? "default" : "secondary"}>
            {hasDBS === "Yes" ? "Has DBS" : "No DBS"}
          </Badge>
        </div>

        {hasDBS === "Yes" && (
          <>
            {dbsNumber && (
              <div className="rounded-lg bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground mb-1">Certificate Number</div>
                <div className="text-sm font-medium font-mono">{dbsNumber}</div>
              </div>
            )}

            <div className="flex gap-2">
              {dbsEnhanced === "Yes" && (
                <Badge variant="outline" className="text-xs">
                  Enhanced
                </Badge>
              )}
              {dbsUpdate === "Yes" && (
                <Badge variant="outline" className="text-xs">
                  Update Service
                </Badge>
              )}
            </div>
          </>
        )}

        {offenceHistory === "Yes" && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Offence history declared
                </div>
                {convictionsDetails && (
                  <div className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                    {convictionsDetails}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">Background Checks</div>
          
          {previousRegistration === "Yes" && (
            <div className="rounded-lg bg-muted/30 p-3">
              <Badge variant="outline" className="text-xs mb-2">Previous Registration</Badge>
              {registrationDetails && (
                <div className="text-xs text-muted-foreground mt-2">
                  {JSON.stringify(registrationDetails)}
                </div>
              )}
            </div>
          )}

          {healthConditions === "Yes" && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-amber-900 dark:text-amber-100">
                    Health Conditions Declared
                  </div>
                  {healthDetails && (
                    <div className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                      {healthDetails}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {smoker === "Yes" && (
            <div className="rounded-lg bg-muted/30 p-3">
              <Badge variant="secondary" className="text-xs">Smoker</Badge>
            </div>
          )}

          {disqualified === "Yes" && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-medium text-red-900 dark:text-red-100">
                  Disqualification Declared
                </div>
              </div>
            </div>
          )}

          {safeguardingConcerns === "Yes" && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-red-900 dark:text-red-100">
                    Safeguarding Concerns Declared
                  </div>
                  {safeguardingDetails && (
                    <div className="text-xs text-red-700 dark:text-red-200 mt-1">
                      {safeguardingDetails}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {otherCircumstances === "Yes" && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-amber-900 dark:text-amber-100">
                    Other Circumstances Declared
                  </div>
                  {otherCircumstancesDetails && (
                    <div className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                      {otherCircumstancesDetails}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppleCard>
  );
};
