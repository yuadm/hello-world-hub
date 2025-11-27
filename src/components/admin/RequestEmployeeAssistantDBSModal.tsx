import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EmployeeAssistant {
  id: string;
  first_name: string;
  last_name: string;
  dbs_status: string;
  dbs_certificate_number: string | null;
  dbs_certificate_date: string | null;
}

interface RequestEmployeeAssistantDBSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: EmployeeAssistant | null;
  onSuccess: () => void;
}

export const RequestEmployeeAssistantDBSModal = ({
  open,
  onOpenChange,
  assistant,
  onSuccess,
}: RequestEmployeeAssistantDBSModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dbs_status: "requested" as const,
    dbs_certificate_number: "",
    dbs_certificate_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistant) return;

    setLoading(true);

    try {
      const updateData: any = {
        dbs_status: formData.dbs_status,
        dbs_request_date: new Date().toISOString(),
      };

      if (formData.dbs_certificate_number) {
        updateData.dbs_certificate_number = formData.dbs_certificate_number;
      }

      if (formData.dbs_certificate_date) {
        updateData.dbs_certificate_date = formData.dbs_certificate_date;
        updateData.dbs_status = "received";
      }

      const { error } = await supabase
        .from('employee_assistants' as any)
        .update(updateData)
        .eq('id', assistant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `DBS ${formData.dbs_certificate_date ? 'recorded' : 'requested'} for ${assistant.first_name} ${assistant.last_name}`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update DBS status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!assistant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {assistant.dbs_status === 'not_requested' ? 'Request' : 'Update'} DBS Check
          </DialogTitle>
          <DialogDescription>
            Record DBS check details for {assistant.first_name} {assistant.last_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dbs_certificate_number">DBS Certificate Number</Label>
            <Input
              id="dbs_certificate_number"
              value={formData.dbs_certificate_number}
              onChange={(e) => setFormData({ ...formData, dbs_certificate_number: e.target.value })}
              placeholder="Optional"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbs_certificate_date">DBS Certificate Date</Label>
            <Input
              id="dbs_certificate_date"
              type="date"
              value={formData.dbs_certificate_date}
              onChange={(e) => setFormData({ ...formData, dbs_certificate_date: e.target.value })}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to mark as "Requested". Enter a date to mark as "Received".
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.dbs_certificate_date ? 'Record Certificate' : 'Request DBS'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};