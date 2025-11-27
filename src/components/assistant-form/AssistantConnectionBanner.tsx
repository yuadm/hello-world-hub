import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AssistantConnectionBannerProps {
  applicantName: string;
  applicantAddress: any;
  assistantName: string;
}

export const AssistantConnectionBanner = ({ 
  applicantName, 
  applicantAddress,
  assistantName 
}: AssistantConnectionBannerProps) => {
  return (
    <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 mb-6">
      <CheckCircle2 className="h-5 w-5 text-green-600" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-semibold text-green-900 dark:text-green-100">
            Connected to Childminder Registration:
          </p>
          <p className="text-green-800 dark:text-green-200">
            <strong>{applicantName}</strong>
          </p>
          {applicantAddress && (
            <p className="text-sm text-green-700 dark:text-green-300">
              {applicantAddress.line1}, {applicantAddress.town}, {applicantAddress.postcode}
            </p>
          )}
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✓ Secure Link Verified
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This information is set by the childminder who invited you. If it is incorrect, 
            you must ask them to cancel this request and send a new, correct invitation.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
