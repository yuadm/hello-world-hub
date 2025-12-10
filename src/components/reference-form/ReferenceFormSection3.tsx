import { UseFormReturn } from "react-hook-form";
import { RKTextarea, RKRadio, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";

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
  isChildcareReference: boolean;
}

export const ReferenceFormSection3 = ({ form, isChildcareReference }: Props) => {
  const { register, watch, setValue } = form;
  const observedWithChildren = watch("observedWithChildren");

  if (!isChildcareReference) {
    return null;
  }

  return (
    <div className="space-y-6">
      <RKSectionTitle 
        title="3. Childcare Suitability" 
        description="Assessment of suitability to work with children"
      />
      
      <RKInfoBox type="warning" title="Childcare Reference">
        This section is required as this is a childcare-related reference.
      </RKInfoBox>

      <RKRadio
        legend="Have you observed the applicant working with or caring for children?"
        required
        name="observedWithChildren"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={observedWithChildren || ""}
        onChange={(value) => setValue("observedWithChildren", value as "Yes" | "No")}
      />

      {observedWithChildren === "Yes" && (
        <RKTextarea
          label="Please describe how they interact with children"
          hint="Include specific examples of their interactions, behavior, and approach with children"
          required
          rows={5}
          {...register("interactionDescription")}
        />
      )}

      <RKTextarea
        label="Do you have any concerns about their suitability to work with children?"
        hint="Please be honest and specific. If you have no concerns, please state 'No concerns'"
        required
        rows={4}
        {...register("suitabilityConcerns")}
      />
    </div>
  );
};