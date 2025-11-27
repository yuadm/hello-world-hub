import { AssistantFormData } from "@/types/assistant";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection5({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">5. Health Declaration</h2>
      
      <div className="space-y-6">
        <GovUKRadio
          name="healthCondition"
          legend="Do you have any health conditions that might affect your ability to care for children?"
          hint="This includes physical or mental health conditions"
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.healthCondition}
          onChange={(value) => setFormData({ ...formData, healthCondition: value })}
          error={validationErrors.healthCondition}
        />

        {formData.healthCondition === "Yes" && (
          <GovUKTextarea
            id="healthConditionDetails"
            label="Please provide details"
            hint="Include how you manage the condition and any support you may need"
            required
            value={formData.healthConditionDetails}
            onChange={(e) => setFormData({ ...formData, healthConditionDetails: e.target.value })}
            rows={4}
          />
        )}

        <GovUKRadio
          name="smoker"
          legend="Do you smoke?"
          hint="This includes cigarettes, vaping, or any other tobacco products"
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.smoker}
          onChange={(value) => setFormData({ ...formData, smoker: value })}
          error={validationErrors.smoker}
        />
      </div>
    </div>
  );
}
