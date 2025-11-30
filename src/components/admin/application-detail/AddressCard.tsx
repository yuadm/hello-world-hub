import { AppleCard } from "@/components/admin/AppleCard";
import { Home, Calendar, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AddressCardProps {
  address: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
  };
  moveIn: string;
  addressHistory?: any[];
  addressGaps?: string;
  livedOutsideUk?: string;
  militaryBase?: string;
}

export const AddressCard = ({ address, moveIn, addressHistory, addressGaps, livedOutsideUk, militaryBase }: AddressCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AppleCard className="p-6">
      <h3 className="text-lg font-semibold tracking-tight mb-4">Address & Residence History</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Home className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-relaxed">
              {address.line1}
              {address.line2 && <><br />{address.line2}</>}
              <br />{address.town}
              <br />{address.postcode}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground mb-0.5">
              Moved In
            </div>
            <div className="text-sm font-medium">{moveIn || "N/A"}</div>
          </div>
        </div>

        {(livedOutsideUk === "Yes" || militaryBase === "Yes") && (
          <div className="flex gap-2 pt-3">
            {livedOutsideUk === "Yes" && (
              <Badge variant="secondary" className="text-xs">Lived Outside UK</Badge>
            )}
            {militaryBase === "Yes" && (
              <Badge variant="secondary" className="text-xs">Military Base</Badge>
            )}
          </div>
        )}

        {addressGaps && (
          <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Address Gaps Identified
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-200">{addressGaps}</div>
              </div>
            </div>
          </div>
        )}

        {addressHistory && addressHistory.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Previous Addresses ({addressHistory.length})</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {addressHistory.map((addr: any, idx: number) => (
                <div key={idx} className="rounded-lg bg-muted/20 p-3 text-sm">
                  <div className="font-medium">
                    {addr.address?.line1}
                    {addr.address?.line2 && <>, {addr.address.line2}</>}
                  </div>
                  <div className="text-muted-foreground">
                    {addr.address?.town}, {addr.address?.postcode}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {addr.moveIn} - {addr.moveOut}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </AppleCard>
  );
};
