import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const requestDBSSchema = z.object({
  memberEmail: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  employeeEmail: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

type RequestDBSFormData = z.infer<typeof requestDBSSchema>;

interface EmployeeRequestDBSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  originalEmployeeEmail: string;
  onSuccess: () => void;
}

export function EmployeeRequestDBSModal({
  open,
  onOpenChange,
  memberId,
  memberName,
  employeeId,
  employeeName,
  employeeEmail,
  originalEmployeeEmail,
  onSuccess,
}: EmployeeRequestDBSModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestDBSFormData>({
    resolver: zodResolver(requestDBSSchema),
    defaultValues: {
      memberEmail: "",
      employeeEmail: employeeEmail,
    },
  });

  const watchedEmployeeEmail = form.watch("employeeEmail");
  const showEmailChangeWarning = watchedEmployeeEmail !== originalEmployeeEmail;

  const onSubmit = async (data: RequestDBSFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Update member email in employee_household_members
      const { error: updateMemberError } = await supabase
        .from("employee_household_members")
        .update({ 
          email: data.memberEmail,
          dbs_request_date: new Date().toISOString(),
          dbs_status: 'requested',
        })
        .eq("id", memberId);

      if (updateMemberError) {
        console.error("Error updating member email:", updateMemberError);
        throw new Error("Failed to save member email");
      }

      // Step 2: If employee email changed, update in employees table
      if (data.employeeEmail !== originalEmployeeEmail) {
        const { error: updateEmployeeError } = await supabase
          .from("employees")
          .update({ email: data.employeeEmail })
          .eq("id", employeeId);

        if (updateEmployeeError) {
          console.error("Error updating employee email:", updateEmployeeError);
          throw new Error("Failed to update employee email");
        }
      }

      // Step 3: Send DBS request email via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-dbs-request-email",
        {
          body: {
            memberId,
            memberName,
            memberEmail: data.memberEmail,
            employeeId,
            employeeName,
            isEmployee: true,
          },
        }
      );

      if (emailError) {
        console.error("Error sending DBS request email:", emailError);
        throw new Error("Failed to send DBS request email");
      }

      toast({
        title: "DBS Request Sent",
        description: `DBS request email sent to ${data.memberEmail}`,
      });

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error in DBS request:", error);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request DBS Check</DialogTitle>
          <DialogDescription>
            Send a DBS check request email to {memberName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="member@example.com"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="employee@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showEmailChangeWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are about to change the employee's email address from{" "}
                  <strong>{originalEmployeeEmail}</strong> to{" "}
                  <strong>{watchedEmployeeEmail}</strong>. This will update
                  their contact information in the system.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send DBS Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}