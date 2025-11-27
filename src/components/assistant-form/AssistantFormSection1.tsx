import { AssistantFormData } from "@/types/assistant";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKSelect } from "@/components/apply/GovUKSelect";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection1({ formData, setFormData, validationErrors = {} }: Props) {
  const addPreviousName = () => {
    setFormData(prev => ({
      ...prev,
      previousNames: [...prev.previousNames, { fullName: "", dateFrom: "", dateTo: "" }]
    }));
  };

  const removePreviousName = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousNames: prev.previousNames.filter((_, i) => i !== index)
    }));
  };

  const updatePreviousName = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousNames: prev.previousNames.map((name, i) =>
        i === index ? { ...name, [field]: value } : name
      )
    }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">1. Your Personal Details</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GovUKSelect
            id="title"
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={validationErrors.title}
            options={[
              { value: "", label: "Select title" },
              { value: "Mr", label: "Mr" },
              { value: "Mrs", label: "Mrs" },
              { value: "Miss", label: "Miss" },
              { value: "Ms", label: "Ms" },
              { value: "Mx", label: "Mx" },
              { value: "Dr", label: "Dr" },
              { value: "Other", label: "Other" }
            ]}
          />
          
          <div className="md:col-span-2">
            <GovUKInput
              id="firstName"
              label="First name(s)"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={validationErrors.firstName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GovUKInput
            id="middleNames"
            label="Middle name(s) (if any)"
            value={formData.middleNames}
            onChange={(e) => setFormData({ ...formData, middleNames: e.target.value })}
          />
          
          <GovUKInput
            id="lastName"
            label="Last name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={validationErrors.lastName}
          />
        </div>

        <GovUKRadio
          name="otherNames"
          legend="Have you been known by any other names?"
          hint="This includes your name at birth if different, maiden names, or names changed by deed poll."
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.otherNames}
          onChange={(value) => setFormData({ ...formData, otherNames: value })}
        />

        {formData.otherNames === "Yes" && (
          <div className="mt-4 space-y-4 p-4 bg-muted rounded-md">
            <h3 className="text-xl font-bold">Previous Names History</h3>
            {formData.previousNames.map((name, index) => (
              <div key={index} className="p-4 border-l-4 border-border bg-card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Name {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePreviousName(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <GovUKInput
                  id={`prevNameFull_${index}`}
                  label="Full name"
                  required
                  value={name.fullName}
                  onChange={(e) => updatePreviousName(index, "fullName", e.target.value)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GovUKInput
                    id={`prevNameStart_${index}`}
                    label="Date from"
                    type="date"
                    required
                    value={name.dateFrom}
                    onChange={(e) => updatePreviousName(index, "dateFrom", e.target.value)}
                  />
                  <GovUKInput
                    id={`prevNameEnd_${index}`}
                    label="Date to"
                    type="date"
                    required
                    value={name.dateTo}
                    onChange={(e) => updatePreviousName(index, "dateTo", e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="secondary"
              onClick={addPreviousName}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another previous name
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GovUKInput
            id="dob"
            label="Date of birth"
            hint="For example, 31 03 1980"
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            error={validationErrors.dob}
          />
          
          <GovUKInput
            id="birthTown"
            label="Town or city of birth"
            required
            value={formData.birthTown}
            onChange={(e) => setFormData({ ...formData, birthTown: e.target.value })}
            error={validationErrors.birthTown}
          />
        </div>

        <GovUKRadio
          name="sex"
          legend="Sex"
          required
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" }
          ]}
          value={formData.sex}
          onChange={(value) => setFormData({ ...formData, sex: value })}
          error={validationErrors.sex}
        />

        <GovUKInput
          id="niNumber"
          label="National Insurance number"
          hint="It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
          required
          validationType="ni-number"
          value={formData.niNumber}
          onChange={(e) => setFormData({ ...formData, niNumber: e.target.value })}
          error={validationErrors.niNumber}
        />
      </div>
    </div>
  );
}
