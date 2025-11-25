import { HouseholdFormData } from "@/pages/HouseholdForm";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
}

export function HouseholdFormSection2({ formData, setFormData }: Props) {
  const addAddressHistory = () => {
    setFormData(prev => ({
      ...prev,
      addressHistory: [...prev.addressHistory, { address: "", moveIn: "", moveOut: "" }]
    }));
  };

  const removeAddressHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.filter((_, i) => i !== index)
    }));
  };

  const updateAddressHistory = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const calculateAddressCoverage = () => {
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const periods = [];
    
    if (formData.homeMoveIn) {
      const moveInDate = new Date(formData.homeMoveIn);
      periods.push({ start: moveInDate, end: today });
    }

    formData.addressHistory.forEach(addr => {
      if (addr.moveIn && addr.moveOut) {
        const moveInDate = new Date(addr.moveIn);
        const moveOutDate = new Date(addr.moveOut);
        periods.push({ start: moveInDate, end: moveOutDate });
      }
    });

    if (periods.length === 0) return "incomplete";

    periods.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    const firstPeriod = periods[0];
    if (firstPeriod.start > fiveYearsAgo) return "incomplete";

    return "complete";
  };

  const coverageStatus = calculateAddressCoverage();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">2. Your Address History</h2>
      <p className="mb-6">
        You must provide a complete history of all addresses where you have lived for the past 5 years. This is a mandatory requirement for background checks.
      </p>

      <h3 className="text-2xl font-bold mb-4">Current Home Address</h3>
      <div className="space-y-4 mb-6">
        <GovUKInput
          id="homeAddressLine1"
          label="Address line 1"
          required
          value={formData.homeAddressLine1}
          onChange={(e) => setFormData({ ...formData, homeAddressLine1: e.target.value })}
        />
        
        <GovUKInput
          id="homeAddressLine2"
          label="Address line 2"
          value={formData.homeAddressLine2}
          onChange={(e) => setFormData({ ...formData, homeAddressLine2: e.target.value })}
        />
        
        <GovUKInput
          id="homeTown"
          label="Town or city"
          required
          className="max-w-md"
          value={formData.homeTown}
          onChange={(e) => setFormData({ ...formData, homeTown: e.target.value })}
        />
        
        <GovUKInput
          id="homePostcode"
          label="Postcode"
          required
          className="max-w-xs"
          value={formData.homePostcode}
          onChange={(e) => setFormData({ ...formData, homePostcode: e.target.value })}
        />
        
        <GovUKInput
          id="homeMoveIn"
          label="When did you move into this address?"
          type="date"
          required
          className="max-w-md"
          value={formData.homeMoveIn}
          onChange={(e) => setFormData({ ...formData, homeMoveIn: e.target.value })}
        />
      </div>

      <h3 className="text-2xl font-bold mb-4">5-Year Address History</h3>
      <p className="mb-4">
        Please add all previous addresses from the last 5 years. Your current address is already recorded above.
      </p>

      {coverageStatus === "incomplete" && (
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 mb-4">
          <p className="font-bold">There are gaps in your 5-year address history</p>
          <p className="text-sm">Please add all previous addresses to complete the 5-year requirement.</p>
        </div>
      )}

      {coverageStatus === "complete" && (
        <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950 mb-4">
          <p className="font-bold">Your 5-year address history is complete</p>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {formData.addressHistory.map((addr, index) => (
          <div key={index} className="p-4 border-l-4 border-border bg-muted space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Previous Address {index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeAddressHistory(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <GovUKTextarea
              id={`historyAddress_${index}`}
              label="Address"
              required
              rows={3}
              value={addr.address}
              onChange={(e) => updateAddressHistory(index, "address", e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GovUKInput
                id={`historyMoveIn_${index}`}
                label="Move-in date"
                type="date"
                required
                value={addr.moveIn}
                onChange={(e) => updateAddressHistory(index, "moveIn", e.target.value)}
              />
              <GovUKInput
                id={`historyMoveOut_${index}`}
                label="Move-out date"
                type="date"
                required
                value={addr.moveOut}
                onChange={(e) => updateAddressHistory(index, "moveOut", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={addAddressHistory}
        className="mb-8"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add previous address
      </Button>

      <div className="space-y-6">
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
        />

        {formData.livedOutsideUK === "Yes" && (
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <p className="mb-4">
              If you have lived outside the UK, you must obtain a police check or 'Certificate of Good Conduct' from the relevant countries. You will need to provide these documents to Ready Kids.
            </p>
            
            <GovUKTextarea
              id="outsideUKDetails"
              label="Please provide details"
              hint="Include which countries, dates, and confirmation that you will provide the required documentation."
              required
              rows={4}
              value={formData.outsideUKDetails}
              onChange={(e) => setFormData({ ...formData, outsideUKDetails: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
