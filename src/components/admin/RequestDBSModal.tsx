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
  applicantEmail: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

type RequestDBSFormData = z.infer<typeof requestDBSSchema>;

interface RequestDBSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  originalApplicantEmail: string;
  onSuccess: () => void;
}

export function RequestDBSModal({
  open,
  onOpenChange,
  memberId,
  memberName,
  applicationId,
  applicantName,
  applicantEmail,
  originalApplicantEmail,
  onSuccess,
}: RequestDBSModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestDBSFormData>({
    resolver: zodResolver(requestDBSSchema),
    defaultValues: {
      memberEmail: "",
      applicantEmail: applicantEmail,
    },
  });

  const watchedApplicantEmail = form.watch("applicantEmail");
  const showEmailChangeWarning = watchedApplicantEmail !== originalApplicantEmail;

  const onSubmit = async (data: RequestDBSFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Update member email in household_member_dbs_tracking
      const { error: updateMemberError } = await supabase
        .from("household_member_dbs_tracking")
        .update({ email: data.memberEmail })
        .eq("id", memberId);

      if (updateMemberError) {
        console.error("Error updating member email:", updateMemberError);
        throw new Error("Failed to save member email");
      }

      // Step 2: If applicant email changed, update in childminder_applications
      if (data.applicantEmail !== originalApplicantEmail) {
        const { error: updateApplicantError } = await supabase
          .from("childminder_applications")
          .update({ email: data.applicantEmail })
          .eq("id", applicationId);

        if (updateApplicantError) {
          console.error("Error updating applicant email:", updateApplicantError);
          throw new Error("Failed to update applicant email");
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
            applicationId,
            applicantName,
          },
        }
      );

      if (emailError) {
        console.error("Error sending DBS request email:", emailError);
        throw new Error("Failed to send DBS request email");
      }

      // Step 4: Send summary email to applicant
      const { error: summaryError } = await supabase.functions.invoke(
        "send-applicant-dbs-summary",
        {
          body: {
            applicationId,
            applicantEmail: data.applicantEmail,
            applicantName,
            requestedMemberIds: [memberId],
          },
        }
      );

      if (summaryError) {
        console.error("Error sending applicant summary email:", summaryError);
        // Don't throw - member request was sent successfully
      }

      toast({
        title: "DBS Request Sent",
        description: `DBS request sent to ${memberName}. Applicant notified to follow up.`,
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
              name="applicantEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicant Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="applicant@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showEmailChangeWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are about to change the applicant's email address from{" "}
                  <strong>{originalApplicantEmail}</strong> to{" "}
                  <strong>{watchedApplicantEmail}</strong>. This will update
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
