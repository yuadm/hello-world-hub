import { HouseholdFormData } from "@/pages/HouseholdForm";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
}

export function HouseholdFormSection4({ formData, setFormData }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">4. Health Declaration</h2>
      <p className="mb-6">
        This information is treated confidentially and helps us ensure you do not pose any medical risk to children.
      </p>

      <div className="space-y-8">
        <div>
          <GovUKRadio
            name="healthCondition"
            legend="Do you have any current or previous medical conditions (physical or mental) that may impact your suitability to be in a home where childminding takes place?"
            hint="This includes significant mental health conditions, neurological conditions, or physical impairments."
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.healthCondition}
            onChange={(value) => setFormData({ ...formData, healthCondition: value })}
          />

          {formData.healthCondition === "Yes" && (
            <div className="mt-4">
              <GovUKTextarea
                id="healthConditionDetails"
                label="Please provide details."
                hint="Include details of the condition, any treatment or medication, and how you manage it. We may require you to complete a full Health Declaration Form signed by your GP."
                required
                rows={5}
                value={formData.healthConditionDetails}
                onChange={(e) => setFormData({ ...formData, healthConditionDetails: e.target.value })}
              />
            </div>
          )}
        </div>

        <GovUKRadio
          name="smoker"
          legend="Are you a smoker?"
          hint="This is for safeguarding and health promotion purposes."
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.smoker}
          onChange={(value) => setFormData({ ...formData, smoker: value })}
        />
      </div>
    </div>
  );
}
