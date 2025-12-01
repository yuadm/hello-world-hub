import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: string;
  full_name: string;
  dbs_status: string;
  dbs_certificate_number: string | null;
  dbs_certificate_date: string | null;
  dbs_certificate_expiry_date: string | null;
  email: string | null;
  notes: string | null;
}

interface UnifiedRecordCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onSave: () => void;
}

export const UnifiedRecordCertificateModal = ({ 
  open, 
  onOpenChange, 
  member, 
  onSave 
}: UnifiedRecordCertificateModalProps) => {
  const [status, setStatus] = useState(member.dbs_status);
  const [certificateNumber, setCertificateNumber] = useState(member.dbs_certificate_number || "");
  const [certificateDate, setCertificateDate] = useState(member.dbs_certificate_date || "");
  const [certificateExpiryDate, setCertificateExpiryDate] = useState(member.dbs_certificate_expiry_date || "");
  const [email, setEmail] = useState(member.email || "");
  const [notes, setNotes] = useState(member.notes || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Auto-calculate expiry date (3 years from issue date)
  const handleCertificateDateChange = (date: string) => {
    setCertificateDate(date);
    if (date && status === 'received') {
      const issueDate = new Date(date);
      issueDate.setFullYear(issueDate.getFullYear() + 3);
      setCertificateExpiryDate(issueDate.toISOString().split('T')[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = {
        dbs_status: status,
        email: email || null,
        notes: notes || null,
      };

      // Only include certificate fields if status is received
      if (status === 'received') {
        if (!certificateNumber || !certificateDate || !certificateExpiryDate) {
          toast({
            title: "Validation Error",
            description: "Certificate number, date, and expiry date are required when status is 'Received'",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
        updateData.dbs_certificate_number = certificateNumber;
        updateData.dbs_certificate_date = certificateDate;
        updateData.dbs_certificate_expiry_date = certificateExpiryDate;
      } else {
        updateData.dbs_certificate_number = null;
        updateData.dbs_certificate_date = null;
        updateData.dbs_certificate_expiry_date = null;
      }

      const { error } = await supabase
        .from('compliance_household_members')
        .update(updateData)
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "DBS information updated successfully",
      });

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record DBS Information</DialogTitle>
          <DialogDescription>
            Update DBS check details for {member.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">DBS Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_requested">Not Requested</SelectItem>
                <SelectItem value="received">Certificate Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used for sending DBS request emails
            </p>
          </div>

          {status === 'received' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="certificate-number">Certificate Number *</Label>
                <Input
                  id="certificate-number"
                  placeholder="001234567890"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-date">Certificate Issue Date *</Label>
                <Input
                  id="certificate-date"
                  type="date"
                  value={certificateDate}
                  onChange={(e) => handleCertificateDateChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-expiry">Certificate Expiry Date *</Label>
                <Input
                  id="certificate-expiry"
                  type="date"
                  value={certificateExpiryDate}
                  onChange={(e) => setCertificateExpiryDate(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Auto-calculated as 3 years from issue date
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this DBS check..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
