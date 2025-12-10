import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { RKInput, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";
import { format } from "date-fns";
import { Check, FileText, Shield } from "lucide-react";

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

interface ConsentItemProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

const ConsentItem = ({ id, label, description, checked, onChange, required }: ConsentItemProps) => (
  <label
    htmlFor={id}
    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
      checked 
        ? "border-[hsl(163,50%,38%)] bg-[hsl(163,50%,38%)]/5" 
        : "border-[#E2E8F0] hover:border-[hsl(163,50%,38%)]/50 hover:bg-[#F8FAFC]"
    }`}
  >
    <div className="flex-shrink-0 mt-0.5">
      <div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
          checked 
            ? "bg-[hsl(163,50%,38%)] border-[hsl(163,50%,38%)]" 
            : "border-[#94A3B8] bg-white"
        }`}
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        required={required}
      />
    </div>
    <div className="flex-1">
      <span className="font-medium text-[#334155]">{label}</span>
      {description && (
        <p className="text-sm text-[#64748B] mt-1">{description}</p>
      )}
    </div>
  </label>
);

export const ReferenceFormSection5 = ({ form }: Props) => {
  const { register, setValue, watch } = form;
  const declarationAccurate = watch("declarationAccurate") || false;

  // Set current date on mount
  useEffect(() => {
    setValue("signatureDate", format(new Date(), "yyyy-MM-dd"));
  }, [setValue]);

  return (
    <div className="space-y-6">
      <RKSectionTitle 
        title="5. Declaration" 
        description="Please read and confirm the declaration below"
      />

      <RKInfoBox type="info" title="Important">
        By signing this reference, you confirm that the information provided is accurate 
        and honest to the best of your knowledge. This reference will be used to assess 
        the applicant's suitability to work with children.
      </RKInfoBox>

      {/* Declaration Consent */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#334155] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[hsl(163,50%,38%)]" />
          Declaration & Consent
        </h3>
        
        <ConsentItem
          id="declarationAccurate"
          label="I confirm that the information in this reference is accurate and honest"
          description="I understand that this reference will be used to assess the applicant's suitability to work with children and that providing false information could have serious consequences."
          checked={declarationAccurate}
          onChange={(checked) => setValue("declarationAccurate", checked)}
          required
        />
      </div>

      {/* Electronic Signature */}
      <div className="bg-gradient-to-br from-[hsl(163,50%,38%)]/5 to-[hsl(188,75%,39%)]/5 rounded-xl p-6 border border-[hsl(163,50%,38%)]/20">
        <h3 className="text-lg font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[hsl(163,50%,38%)]" />
          Electronic Signature
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RKInput
            label="Full name (signature)"
            hint="Type your full name as your electronic signature"
            required
            {...register("signatureName")}
          />

          <RKInput
            label="Print name"
            hint="Please print your name clearly"
            required
            {...register("signaturePrintName")}
          />
        </div>

        <div className="mt-4">
          <RKInput
            label="Date"
            type="date"
            required
            {...register("signatureDate")}
          />
        </div>

        <p className="text-xs text-[#64748B] mt-4">
          By typing your name above, you are providing an electronic signature which has the same 
          legal validity as a handwritten signature.
        </p>
      </div>
    </div>
  );
};