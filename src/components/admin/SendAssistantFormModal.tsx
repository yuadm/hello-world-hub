import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SendAssistantFormModalProps {
  assistant: any;
  applicantEmail: string;
  applicantName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const SendAssistantFormModal = ({
  assistant,
  applicantEmail,
  applicantName,
  onClose,
  onSuccess,
}: SendAssistantFormModalProps) => {
  const [email, setEmail] = useState(assistant.email || "");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-assistant-form-email', {
        body: {
          assistantId: assistant.id,
          customEmail: email,
          applicantEmail,
          applicantName,
        },
      });

      if (error) throw error;

      toast({
        title: "Form Sent",
        description: `CMA-A1 form sent to ${email}`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send CMA-A1 Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Send the CMA-A1 suitability form to <strong>{assistant.first_name} {assistant.last_name}</strong>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="assistant@example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend} disabled={sending || !email}>
              {sending ? "Sending..." : "Send Form"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
