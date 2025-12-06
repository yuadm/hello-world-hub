import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Building2, ExternalLink } from "lucide-react";

interface SendLAFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  dateOfBirth: string;
  currentAddress: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
    moveInDate: string;
  };
  previousAddresses?: Array<{
    address: string;
    dateFrom: string;
    dateTo: string;
  }>;
  previousNames?: Array<{
    name: string;
    dateFrom: string;
    dateTo: string;
  }>;
  role: 'childminder' | 'household_member' | 'assistant' | 'manager' | 'nominated_individual';
  localAuthority: string;
  agencyName?: string;
  parentId?: string;
  parentType?: 'application' | 'employee';
  onSuccess?: () => void;
}

export const SendLAFormModal = ({
  open,
  onOpenChange,
  applicantName,
  dateOfBirth,
  currentAddress,
  previousAddresses,
  previousNames,
  role,
  localAuthority,
  agencyName = 'ReadyKids Childminder Agency',
  parentId,
  parentType,
  onSuccess,
}: SendLAFormModalProps) => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [laEmail, setLaEmail] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterRole, setRequesterRole] = useState("");

  const handleSend = async () => {
    if (!requesterName.trim() || !requesterRole.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and role",
        variant: "destructive",
      });
      return;
    }

    if (!laEmail.trim()) {
      toast({
        title: "Missing Email",
        description: "Please provide the Local Authority email address",
        variant: "destructive",
      });
      return;
    }

    if (!localAuthority) {
      toast({
        title: "Missing Local Authority",
        description: "Local Authority is not set for this application",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-la-check-email', {
        body: {
          laEmail,
          applicantName,
          dateOfBirth,
          currentAddress,
          previousAddresses,
          previousNames,
          role,
          localAuthority,
          requesterName,
          requesterRole,
          agencyName,
          parentId,
          parentType,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `LA check request sent to ${laEmail}`,
      });

      onOpenChange(false);
      setRequesterName("");
      setRequesterRole("");
      setLaEmail("");
      onSuccess?.();
    } catch (error) {
      console.error('Error sending LA check email:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const roleLabels: Record<string, string> = {
    childminder: 'Childminder',
    household_member: 'Household Member',
    assistant: 'Assistant',
    manager: 'Manager',
    nominated_individual: 'Nominated Individual',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Send Local Authority Check Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview Section */}
          <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-2">
            <h3 className="font-semibold text-sm">Applicant Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span> {applicantName || 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">DOB:</span> {dateOfBirth || 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span> {roleLabels[role] || role}
              </div>
              <div>
                <span className="text-muted-foreground">Postcode:</span> {currentAddress?.postcode || 'N/A'}
              </div>
            </div>
          </div>

          {/* Local Authority Info */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Local Authority</span>
            </div>
            <p className="text-lg font-medium">{localAuthority || 'Not set'}</p>
            {!localAuthority && (
              <p className="text-sm text-destructive mt-1">
                Please set the Local Authority in the application details before sending this request.
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="laEmail">Local Authority Email Address *</Label>
              <Input
                id="laEmail"
                type="email"
                value={laEmail}
                onChange={(e) => setLaEmail(e.target.value)}
                placeholder="childrens.services@localauthority.gov.uk"
              />
              <p className="text-xs text-muted-foreground">
                The secure email address for the LA Children's Services team
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterName">Your Name *</Label>
              <Input
                id="requesterName"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterRole">Your Role at Agency *</Label>
              <Input
                id="requesterRole"
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value)}
                placeholder="e.g., Safeguarding and Compliance Lead"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 text-sm">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              How it works:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>A formal letter with applicant details will be emailed to the LA</li>
              <li>The LA clicks the link to access the response form</li>
              <li>LA selects one of four response options (known/not known/relevant info)</li>
              <li>Response is submitted back to your agency dashboard</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={sending || !localAuthority} 
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            {sending ? "Sending..." : "Send to Local Authority"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
