import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKInput } from "./GovUKInput";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKButton } from "./GovUKButton";
import { GovUKTextarea } from "./GovUKTextarea";
import { GovUKAutocomplete } from "./GovUKAutocomplete";
import { UK_LOCAL_AUTHORITIES } from "@/lib/ukLocalAuthorities";
import { Plus, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { lookupPostcode, validatePostcode } from "@/lib/postcodeService";
import { toast } from "sonner";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section3Premises = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const [isLookingUpChildcarePostcode, setIsLookingUpChildcarePostcode] = useState(false);
  const premisesType = watch("premisesType");
  const sameAddress = watch("sameAddress");
  const useAdditionalPremises = watch("useAdditionalPremises");
  const additionalPremises = watch("additionalPremises") || [];
  const pets = watch("pets");
  const childcarePostcode = watch("childcareAddress.postcode");

  const showChildcareAddress =
    (premisesType === "Domestic" && sameAddress === "No") || premisesType === "Non-domestic";

  const addAdditionalPremises = () => {
    setValue("additionalPremises", [...additionalPremises, { address: "", reason: "" }]);
  };

  const removeAdditionalPremises = (index: number) => {
    setValue("additionalPremises", additionalPremises.filter((_, i) => i !== index));
  };

  const handleChildcarePostcodeLookup = async () => {
    if (!childcarePostcode) {
      toast.error("Please enter a postcode first");
      return;
    }

    if (!validatePostcode(childcarePostcode)) {
      toast.error("Please enter a valid UK postcode");
      return;
    }

    setIsLookingUpChildcarePostcode(true);
    try {
      const result = await lookupPostcode(childcarePostcode);
      
      if (result) {
        setValue("childcareAddress.town", result.admin_district || result.region || "");
        setValue("childcareAddress.postcode", result.postcode);
        toast.success("Postcode found! Please complete the address details.");
      } else {
        toast.error("Postcode not found. Please check and try again.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to lookup postcode");
    } finally {
      setIsLookingUpChildcarePostcode(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">3. Your Childminding Premises</h2>

      <h3 className="text-xl font-bold">Primary Childcare Premises</h3>

      <GovUKAutocomplete
        label="Local authority / council"
        hint="This is the local authority where the childcare premises is located. Start typing to search."
        required
        options={UK_LOCAL_AUTHORITIES}
        value={watch("localAuthority")}
        onChange={(value) => setValue("localAuthority", value)}
        placeholder="Start typing..."
      />

      <GovUKRadio
        legend="What type of premises will you primarily work from?"
        required
        name="premisesType"
        options={[
          { value: "Domestic", label: "Domestic (a home)" },
          { value: "Non-domestic", label: "Non-domestic (e.g., community hall, school site)" },
        ]}
        value={premisesType || "Domestic"}
        onChange={(value) => setValue("premisesType", value as "Domestic" | "Non-domestic")}
      />

      {premisesType === "Domestic" && (
        <GovUKRadio
          legend="Will this be your own home address?"
          required
          name="sameAddress"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={sameAddress || "Yes"}
          onChange={(value) => setValue("sameAddress", value as "Yes" | "No")}
        />
      )}

      {showChildcareAddress && (
        <div className="space-y-4 p-4 border-l-[10px] border-[hsl(var(--govuk-grey-border))] bg-[hsl(var(--govuk-inset-grey))]">
          <p className="text-sm">
            Please provide the full address of the premises. If it is a domestic address that is not
            your own home, we will need to conduct suitability checks on everyone living there aged
            16 or over.
          </p>
          <div>
            <GovUKInput
              label="Postcode"
              required
              widthClass="10"
              placeholder="e.g. SW1A 1AA"
              {...register("childcareAddress.postcode")}
            />
            <div className="mt-3">
              <GovUKButton
                type="button"
                variant="secondary"
                onClick={handleChildcarePostcodeLookup}
                disabled={isLookingUpChildcarePostcode || !childcarePostcode}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {isLookingUpChildcarePostcode ? "Looking up..." : "Find address"}
              </GovUKButton>
            </div>
          </div>
          <GovUKInput
            label="Childcare Address - Line 1"
            required
            {...register("childcareAddress.line1")}
          />
          <GovUKInput label="Address line 2" {...register("childcareAddress.line2")} />
          <GovUKInput label="Town or city" required {...register("childcareAddress.town")} />
        </div>
      )}

      <GovUKRadio
        legend="Will you regularly use any additional premises for childminding?"
        hint="You do not need to tell us about routine outings (e.g., parks, libraries). This is for regular use of other settings (e.g., using a local hall for 50% of the time)."
        required
        name="useAdditionalPremises"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={useAdditionalPremises || "No"}
        onChange={(value) => setValue("useAdditionalPremises", value as "Yes" | "No")}
      />

      {useAdditionalPremises === "Yes" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Additional Premises Details</h3>
          {additionalPremises.map((_, index) => (
            <div
              key={index}
              className="p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Additional Premises {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAdditionalPremises(index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKTextarea
                label="Full address"
                {...register(`additionalPremises.${index}.address`)}
                rows={3}
              />
              <GovUKTextarea
                label="Reason for using this premises"
                {...register(`additionalPremises.${index}.reason`)}
                rows={2}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={addAdditionalPremises}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add premises
          </GovUKButton>
        </div>
      )}

      <GovUKRadio
        legend="Do you have an outdoor space available for children at your premises?"
        required
        name="outdoorSpace"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={watch("outdoorSpace") || "No"}
        onChange={(value) => setValue("outdoorSpace", value as "Yes" | "No")}
      />

      <GovUKRadio
        legend="Do you have any pets at your premises?"
        required
        name="pets"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={pets || "No"}
        onChange={(value) => setValue("pets", value as "Yes" | "No")}
      />

      {pets === "Yes" && (
        <GovUKTextarea
          label="Please provide details of your pets"
          hint="Include type of animal, breed, temperament, and how they will be managed during childcare hours."
          required
          rows={4}
          {...register("petsDetails")}
        />
      )}
    </div>
  );
};
