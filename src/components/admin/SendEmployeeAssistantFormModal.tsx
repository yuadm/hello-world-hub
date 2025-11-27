import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmployeeAssistant {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
}

interface SendEmployeeAssistantFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: EmployeeAssistant | null;
  employeeEmail: string;
  employeeName: string;
  onSuccess: () => void;
}

export const SendEmployeeAssistantFormModal = ({
  open,
  onOpenChange,
  assistant,
  employeeEmail,
  employeeName,
  onSuccess,
}: SendEmployeeAssistantFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!assistant || !assistant.email) return;

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-assistant-form-email', {
        body: {
          assistantId: assistant.id,
          employeeEmail: employeeEmail,
          employeeName: employeeName,
          isEmployee: true,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `CMA-A1 form sent to ${assistant.first_name} ${assistant.last_name}`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send form",
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
            Send CMA-A1 Form
          </DialogTitle>
          <DialogDescription>
            Send the assistant compliance form to {assistant.first_name} {assistant.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!assistant.email && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This assistant has no email address. Please update their details before sending the form.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">{assistant.first_name} {assistant.last_name}</p>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{assistant.email || "Not provided"}</p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The assistant will receive an email with a secure link to complete the CMA-A1 form.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={loading || !assistant.email}
              className="rounded-xl"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};