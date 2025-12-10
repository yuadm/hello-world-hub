import { UseFormReturn } from "react-hook-form";
import { RKInput, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";
import { User } from "lucide-react";

interface ReferenceFormData {
  confirmedRelationship: string;
  knownForYears: string;
  characterDescription: string;
  isReliable: "Yes" | "No" | "";
  reliableComments?: string;
  isPatient: "Yes" | "No" | "";
  patientComments?: string;
  hasGoodJudgment: "Yes" | "No" | "";
  judgmentComments?: string;
  observedWithChildren?: "Yes" | "No" | "";
  interactionDescription?: string;
  suitabilityConcerns?: string;
  integrityConcerns: "Yes" | "No" | "";
  integrityConcernsDetails?: string;
  wouldRecommend: "Yes" | "No" | "";
  recommendationComments?: string;
  additionalInformation?: string;
  declarationAccurate: boolean;
  signatureName: string;
  signaturePrintName: string;
  signatureDate: string;
}

interface Props {
  form: UseFormReturn<Partial<ReferenceFormData>>;
  refereeName: string;
  applicantName: string;
}

export const ReferenceFormSection1 = ({ form, refereeName, applicantName }: Props) => {
  const { register } = form;

  return (
    <div className="space-y-6">
      <RKSectionTitle 
        title="1. Confirmation" 
        description="Confirm your relationship with the applicant"
      />

      <RKInfoBox type="info" title="Reference Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span><strong>Applicant:</strong> {applicantName}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span><strong>Your name:</strong> {refereeName}</span>
          </div>
        </div>
      </RKInfoBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RKInput
          label="Relationship to applicant"
          hint="For example: Former employer, colleague, friend, etc."
          required
          {...register("confirmedRelationship")}
        />

        <RKInput
          label="How long have you known them?"
          hint="For example: 5 years, 10 years, etc."
          required
          {...register("knownForYears")}
        />
      </div>
    </div>
  );
};