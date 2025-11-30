import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UnifiedRequestAssistantDBSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistantId: string;
  assistantName: string;
  assistantEmail: string;
  parentEmail: string;
  onSuccess: () => void;
}

export function UnifiedRequestAssistantDBSModal({
  open,
  onOpenChange,
  assistantId,
  assistantName,
  assistantEmail,
  parentEmail,
  onSuccess,
}: UnifiedRequestAssistantDBSModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(assistantEmail || "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update assistant email if changed
      if (email !== assistantEmail) {
        const { error: updateError } = await supabase
          .from("compliance_assistants")
          .update({ email })
          .eq("id", assistantId);

        if (updateError) throw new Error("Failed to update assistant email");
      }

      // Update DBS status and request date
      const { error: statusError } = await supabase
        .from("compliance_assistants")
        .update({
          dbs_status: "requested",
          dbs_request_date: new Date().toISOString(),
          last_contact_date: new Date().toISOString(),
        })
        .eq("id", assistantId);

      if (statusError) throw new Error("Failed to update DBS status");

      // Send DBS request email via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-dbs-request-email",
        {
          body: {
            memberId: assistantId,
            memberEmail: email,
            applicantEmail: parentEmail,
            isAssistant: true,
          },
        }
      );

      if (emailError) throw new Error("Failed to send DBS request email");

      toast({
        title: "DBS Request Sent",
        description: `DBS request sent to ${assistantName} at ${email}`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error requesting assistant DBS:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send DBS request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Assistant DBS Check</DialogTitle>
          <DialogDescription>
            Send a DBS check request to {assistantName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Assistant Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="assistant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send DBS Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
