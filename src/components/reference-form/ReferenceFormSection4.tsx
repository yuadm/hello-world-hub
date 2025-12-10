import { UseFormReturn } from "react-hook-form";
import { RKTextarea, RKRadio, RKSectionTitle } from "@/components/apply/rk";

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
}

export const ReferenceFormSection4 = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const integrityConcerns = watch("integrityConcerns");
  const wouldRecommend = watch("wouldRecommend");

  return (
    <div className="space-y-6">
      <RKSectionTitle 
        title="4. Professional Assessment" 
        description="Your professional opinion on the applicant"
      />

      <RKRadio
        legend="Do you have any concerns about their honesty or integrity?"
        required
        name="integrityConcerns"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={integrityConcerns || ""}
        onChange={(value) => setValue("integrityConcerns", value as "Yes" | "No")}
      />

      {integrityConcerns === "Yes" && (
        <RKTextarea
          label="Please provide details of your concerns"
          required
          rows={4}
          {...register("integrityConcernsDetails")}
        />
      )}

      <RKRadio
        legend="Would you recommend this person for a role involving responsibility for children?"
        required
        name="wouldRecommend"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={wouldRecommend || ""}
        onChange={(value) => setValue("wouldRecommend", value as "Yes" | "No")}
      />

      <RKTextarea
        label="Please explain your recommendation"
        required
        rows={4}
        {...register("recommendationComments")}
      />

      <RKTextarea
        label="Is there any additional information we should know?"
        hint="Include any other relevant information about the applicant's suitability"
        rows={4}
        {...register("additionalInformation")}
      />
    </div>
  );
};