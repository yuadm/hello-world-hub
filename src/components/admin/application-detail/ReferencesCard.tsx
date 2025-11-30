import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, CheckCircle2 } from "lucide-react";

interface ReferencesCardProps {
  reference1Name: string;
  reference1Relationship: string;
  reference1Contact: string;
  reference1Childcare?: string;
  reference2Name: string;
  reference2Relationship: string;
  reference2Contact: string;
  reference2Childcare?: string;
  childVolunteered?: string;
  childVolunteeredConsent?: boolean;
}

export const ReferencesCard = ({
  reference1Name,
  reference1Relationship,
  reference1Contact,
  reference1Childcare,
  reference2Name,
  reference2Relationship,
  reference2Contact,
  reference2Childcare,
  childVolunteered,
  childVolunteeredConsent,
}: ReferencesCardProps) => {
  const ReferenceItem = ({ name, relationship, contact, isChildcare }: { name: string; relationship: string; contact: string; isChildcare?: string }) => (
    <div className="rounded-lg bg-muted/30 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium">{name || "N/A"}</div>
        {isChildcare === "Yes" && (
          <Badge variant="secondary" className="text-xs">Childcare Ref</Badge>
        )}
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>Relationship: {relationship || "N/A"}</div>
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {contact || "N/A"}
        </div>
      </div>
    </div>
  );

  return (
    <AppleCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">References</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Reference 1</div>
          <ReferenceItem
            name={reference1Name}
            relationship={reference1Relationship}
            contact={reference1Contact}
            isChildcare={reference1Childcare}
          />
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Reference 2</div>
          <ReferenceItem
            name={reference2Name}
            relationship={reference2Relationship}
            contact={reference2Contact}
            isChildcare={reference2Childcare}
          />
        </div>

        {childVolunteered === "Yes" && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Volunteered with Children</div>
                {childVolunteeredConsent && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Consent given for reference contact
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppleCard>
  );
};
