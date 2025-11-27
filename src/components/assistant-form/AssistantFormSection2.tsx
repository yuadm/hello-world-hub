import { AssistantFormData } from "@/types/assistant";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertCircle } from "lucide-react";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection2({ formData, setFormData, validationErrors = {} }: Props) {
  const addPreviousAddress = () => {
    setFormData(prev => ({
      ...prev,
      addressHistory: [...prev.addressHistory, { address: "", moveIn: "", moveOut: "" }]
    }));
  };

  const removePreviousAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.filter((_, i) => i !== index)
    }));
  };

  const updateAddress = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  // Calculate 5-year coverage
  const calculateCoverage = () => {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    
    if (!formData.homeMoveIn) return { hasGaps: false, coverageDate: null };
    
    const moveInDate = new Date(formData.homeMoveIn);
    if (moveInDate <= fiveYearsAgo) return { hasGaps: false, coverageDate: null };
    
    let coverageDate = moveInDate;
    if (formData.addressHistory.length > 0) {
      const sortedHistory = [...formData.addressHistory]
        .filter(a => a.moveIn)
        .sort((a, b) => new Date(a.moveIn).getTime() - new Date(b.moveIn).getTime());
      
      if (sortedHistory.length > 0) {
        coverageDate = new Date(sortedHistory[0].moveIn);
      }
    }
    
    return {
      hasGaps: coverageDate > fiveYearsAgo,
      coverageDate,
      targetDate: fiveYearsAgo
    };
  };

  const coverage = calculateCoverage();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">2. Your Address History</h2>
      <p className="text-base mb-6 text-muted-foreground">
        You must provide a complete history of all addresses where you have lived for the past 5 years. 
        This is a mandatory requirement for background checks.
      </p>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Current Home Address</h3>
        
        <GovUKInput
          id="homeAddressLine1"
          label="Address line 1"
          required
          value={formData.homeAddressLine1}
          onChange={(e) => setFormData({ ...formData, homeAddressLine1: e.target.value })}
          error={validationErrors.homeAddressLine1}
        />

        <GovUKInput
          id="homeAddressLine2"
          label="Address line 2"
          value={formData.homeAddressLine2}
          onChange={(e) => setFormData({ ...formData, homeAddressLine2: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GovUKInput
            id="homeTown"
            label="Town or city"
            required
            value={formData.homeTown}
            onChange={(e) => setFormData({ ...formData, homeTown: e.target.value })}
            error={validationErrors.homeTown}
          />
          
          <GovUKInput
            id="homePostcode"
            label="Postcode"
            required
            validationType="postcode"
            value={formData.homePostcode}
            onChange={(e) => setFormData({ ...formData, homePostcode: e.target.value })}
            error={validationErrors.homePostcode}
          />
        </div>

        <GovUKInput
          id="homeMoveIn"
          label="When did you move into this address?"
          type="date"
          required
          value={formData.homeMoveIn}
          onChange={(e) => setFormData({ ...formData, homeMoveIn: e.target.value })}
          error={validationErrors.homeMoveIn}
        />

        {coverage.hasGaps && (
          <div className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 p-4 rounded">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  5-Year Address History Required
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Your current address starts on {new Date(formData.homeMoveIn).toLocaleDateString()}.
                  Please add previous addresses to cover from{" "}
                  {coverage.targetDate?.toLocaleDateString()} until this date.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-6 mt-8">
          <h3 className="text-2xl font-bold mb-4">5-Year Address History</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please add all previous addresses from the last 5 years. Your current address is already recorded above.
          </p>

          {formData.addressHistory.length > 0 && (
            <div className="space-y-4 mb-4">
              {formData.addressHistory.map((addr, index) => (
                <div key={index} className="p-4 border-l-4 border-border bg-card space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Previous Address {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePreviousAddress(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <GovUKInput
                    id={`prevAddress_${index}`}
                    label="Full address"
                    required
                    value={addr.address}
                    onChange={(e) => updateAddress(index, "address", e.target.value)}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GovUKInput
                      id={`prevAddressMoveIn_${index}`}
                      label="Move in date"
                      type="date"
                      required
                      value={addr.moveIn}
                      onChange={(e) => updateAddress(index, "moveIn", e.target.value)}
                    />
                    <GovUKInput
                      id={`prevAddressMoveOut_${index}`}
                      label="Move out date"
                      type="date"
                      hint="Leave blank if current"
                      value={addr.moveOut}
                      onChange={(e) => updateAddress(index, "moveOut", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={addPreviousAddress}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add previous address
          </Button>
        </div>

        <GovUKRadio
          name="livedOutsideUK"
          legend="Have you lived outside the UK in the last 5 years?"
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.livedOutsideUK}
          onChange={(value) => setFormData({ ...formData, livedOutsideUK: value })}
          error={validationErrors.livedOutsideUK}
        />
      </div>
    </div>
  );
}
