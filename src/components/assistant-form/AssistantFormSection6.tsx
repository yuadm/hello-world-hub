import { AssistantFormData } from "@/types/assistant";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection6({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">6. Declaration & Submission</h2>
      
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm font-medium mb-4">
            Before you submit this form, please read and confirm the following declarations:
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentChecks"
                checked={formData.consentChecks}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, consentChecks: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label
                  htmlFor="consentChecks"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I consent to background checks *
                </Label>
                <p className="text-sm text-muted-foreground">
                  I consent to DBS checks, reference checks, and verification of information provided in this form.
                </p>
              </div>
            </div>
            {validationErrors.consentChecks && (
              <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{validationErrors.consentChecks}</span>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="declarationTruth"
                checked={formData.declarationTruth}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, declarationTruth: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label
                  htmlFor="declarationTruth"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I confirm this information is true *
                </Label>
                <p className="text-sm text-muted-foreground">
                  I confirm that the information I have provided in this form is true and complete to the best of my knowledge.
                </p>
              </div>
            </div>
            {validationErrors.declarationTruth && (
              <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{validationErrors.declarationTruth}</span>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="declarationNotify"
                checked={formData.declarationNotify}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, declarationNotify: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label
                  htmlFor="declarationNotify"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I agree to notify of changes *
                </Label>
                <p className="text-sm text-muted-foreground">
                  I understand that I must notify the childminder of any changes to the information provided in this form.
                </p>
              </div>
            </div>
            {validationErrors.declarationNotify && (
              <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{validationErrors.declarationNotify}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <h3 className="text-2xl font-bold mb-4">Electronic Signature</h3>
          <p className="text-sm text-muted-foreground mb-6">
            By typing your full name below, you are electronically signing this form.
          </p>

          <GovUKInput
            id="signatureFullName"
            label="Full name (electronic signature)"
            hint="Type your full name exactly as it appears in Section 1"
            required
            value={formData.signatureFullName}
            onChange={(e) => setFormData({ ...formData, signatureFullName: e.target.value })}
            error={validationErrors.signatureFullName}
          />

          <GovUKInput
            id="signatureDate"
            label="Date"
            type="date"
            required
            value={formData.signatureDate}
            onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
            disabled
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Once you submit this form, you will receive a confirmation email. 
            The childminder will also be notified of your submission.
          </p>
        </div>
      </div>
    </div>
  );
}
