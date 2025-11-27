import { AssistantFormData } from "@/types/assistant";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection3({ formData, setFormData, validationErrors = {} }: Props) {
  const addEmployment = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [...prev.employmentHistory, { employer: "", title: "", startDate: "", endDate: "" }]
    }));
  };

  const removeEmployment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((_, i) => i !== index)
    }));
  };

  const updateEmployment = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      )
    }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">3. Professional History & Training</h2>
      <p className="text-base mb-6 text-muted-foreground">
        Provide a full history since leaving full-time education to help us understand your background 
        and identify any safeguarding concerns.
      </p>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Employment & Education History</h3>
        
        {formData.employmentHistory.length > 0 && (
          <div className="space-y-4">
            {formData.employmentHistory.map((emp, index) => (
              <div key={index} className="p-4 border-l-4 border-border bg-card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Role / Course {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEmployment(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <GovUKInput
                  id={`employer_${index}`}
                  label="Employer / Education provider"
                  required
                  value={emp.employer}
                  onChange={(e) => updateEmployment(index, "employer", e.target.value)}
                  error={validationErrors[`employment_${index}_employer`]}
                />
                
                <GovUKInput
                  id={`jobTitle_${index}`}
                  label="Job title / Course"
                  required
                  value={emp.title}
                  onChange={(e) => updateEmployment(index, "title", e.target.value)}
                  error={validationErrors[`employment_${index}_title`]}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GovUKInput
                    id={`empStartDate_${index}`}
                    label="Start date"
                    type="date"
                    required
                    value={emp.startDate}
                    onChange={(e) => updateEmployment(index, "startDate", e.target.value)}
                    error={validationErrors[`employment_${index}_startDate`]}
                  />
                  <GovUKInput
                    id={`empEndDate_${index}`}
                    label="End date"
                    type="date"
                    hint="Leave blank if current"
                    value={emp.endDate}
                    onChange={(e) => updateEmployment(index, "endDate", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          onClick={addEmployment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add employment or education
        </Button>

        <GovUKTextarea
          id="employmentGaps"
          label="Explanation for gaps (if any)"
          value={formData.employmentGaps}
          onChange={(e) => setFormData({ ...formData, employmentGaps: e.target.value })}
          rows={3}
        />

        <div className="border-t pt-6 mt-8">
          <h3 className="text-2xl font-bold mb-4">Training Declaration</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Your employer is responsible for ensuring you have valid training. Please declare what you have completed.
          </p>

          <GovUKRadio
            name="pfaCompleted"
            legend="Paediatric First Aid (PFA)"
            required
            options={[
              { value: "Yes", label: "Yes, I have a certificate" },
              { value: "No", label: "No / It has expired" }
            ]}
            value={formData.pfaCompleted}
            onChange={(value) => setFormData({ ...formData, pfaCompleted: value })}
            error={validationErrors.pfaCompleted}
          />

          <GovUKRadio
            name="safeguardingCompleted"
            legend="Safeguarding / Child Protection Training"
            required
            options={[
              { value: "Yes", label: "Yes, I have a certificate" },
              { value: "No", label: "No / It has expired" }
            ]}
            value={formData.safeguardingCompleted}
            onChange={(value) => setFormData({ ...formData, safeguardingCompleted: value })}
            error={validationErrors.safeguardingCompleted}
          />
        </div>
      </div>
    </div>
  );
}
