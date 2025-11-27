import { useState, useEffect } from "react";
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
  email: string | null;
  phone: string | null;
  role: string;
  date_of_birth: string;
}

interface AddEditEmployeeAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeEmail: string;
  employeeName: string;
  assistant: EmployeeAssistant | null;
  onSuccess: () => void;
}

export const AddEditEmployeeAssistantModal = ({
  open,
  onOpenChange,
  employeeId,
  employeeEmail,
  employeeName,
  assistant,
  onSuccess,
}: AddEditEmployeeAssistantModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (assistant) {
      setFormData({
        first_name: assistant.first_name,
        last_name: assistant.last_name,
        email: assistant.email || "",
        phone: assistant.phone || "",
        role: assistant.role,
        date_of_birth: assistant.date_of_birth,
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        date_of_birth: "",
      });
    }
  }, [assistant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (assistant) {
        // Update existing assistant
        const { error } = await supabase
          .from('employee_assistants' as any)
          .update(formData)
          .eq('id', assistant.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assistant updated successfully",
        });
      } else {
        // Add new assistant
        const { data: newAssistant, error: insertError } = await supabase
          .from('employee_assistants' as any)
          .insert({
            ...formData,
            employee_id: employeeId,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const assistantData = newAssistant as any;

        // Automatically send form email
        const { error: emailError } = await supabase.functions.invoke('send-assistant-form-email', {
          body: {
            assistantId: assistantData.id,
            employeeEmail: employeeEmail,
            employeeName: employeeName,
            isEmployee: true,
          }
        });

        if (emailError) {
          console.error('Failed to send form email:', emailError);
          toast({
            title: "Assistant Added",
            description: "Assistant added but failed to send form email. You can resend it manually.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Assistant added and form email sent successfully",
          });
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save assistant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {assistant ? "Edit Assistant" : "Add Assistant"}
          </DialogTitle>
          <DialogDescription>
            {assistant 
              ? "Update assistant information" 
              : "Add a new assistant and automatically send them the CMA-A1 form"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              placeholder="e.g., Assistant Childminder, Co-childminder"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              required
              className="rounded-xl"
            />
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
              {assistant ? "Update" : "Add & Send Form"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};