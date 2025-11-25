import { HouseholdFormData } from "@/pages/HouseholdForm";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
}

export function HouseholdFormSection3({ formData, setFormData }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">3. Vetting & Suitability</h2>
      <p className="mb-6">
        This section covers mandatory background checks required for anyone living or working in a childminding setting.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Previous Registrations</h3>
          <GovUKRadio
            name="prevReg"
            legend="Have you ever been registered with Ofsted, a childminder agency, or any other regulatory body for childcare?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.prevReg}
            onChange={(value) => setFormData({ ...formData, prevReg: value })}
          />

          {formData.prevReg === "Yes" && (
            <div className="mt-4">
              <GovUKTextarea
                id="prevRegInfo"
                label="Please provide details (e.g., body name, registration number, dates)."
                required
                rows={4}
                value={formData.prevRegInfo}
                onChange={(e) => setFormData({ ...formData, prevRegInfo: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">DBS (Disclosure and Barring Service)</h3>
          <GovUKRadio
            name="hasDBS"
            legend="Do you currently hold an Enhanced DBS certificate for a child workforce role?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.hasDBS}
            onChange={(value) => setFormData({ ...formData, hasDBS: value })}
          />

          {formData.hasDBS === "No" && (
            <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You must obtain an Enhanced DBS check. We will initiate this process for you upon submission of this form.
              </AlertDescription>
            </Alert>
          )}

          {formData.hasDBS === "Yes" && (
            <div className="mt-4 space-y-6">
              <GovUKInput
                id="dbsNumber"
                label="DBS certificate number (12 digits)"
                required
                className="max-w-xs"
                maxLength={12}
                pattern="\d{12}"
                value={formData.dbsNumber}
                onChange={(e) => setFormData({ ...formData, dbsNumber: e.target.value })}
              />

              <GovUKRadio
                name="dbsUpdate"
                legend="Are you subscribed to the DBS Update Service?"
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]}
                value={formData.dbsUpdate}
                onChange={(value) => setFormData({ ...formData, dbsUpdate: value })}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Criminal History Declaration</h3>
          
          <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You must declare everything, no matter how long ago it occurred. Due to the nature of working with children, the rules on 'spent' convictions do not apply. This will be verified by your DBS check.
            </AlertDescription>
          </Alert>

          <GovUKRadio
            name="offenceHistory"
            legend="Have you ever received a reprimand, warning, caution, or conviction for any criminal offence?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.offenceHistory}
            onChange={(value) => setFormData({ ...formData, offenceHistory: value })}
          />

          {formData.offenceHistory === "Yes" && (
            <div className="mt-4">
              <GovUKTextarea
                id="offenceDetails"
                label="Please provide details of all offences."
                required
                rows={5}
                value={formData.offenceDetails}
                onChange={(e) => setFormData({ ...formData, offenceDetails: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Suitability Declaration</h3>
          
          <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You are 'disqualified' if you have been barred from working with children, had a child removed from your care by court order, or had a registration cancelled in the past. Review the official{" "}
              <a 
                href="https://www.gov.uk/guidance/disqualification-under-the-childcare-act-2006" 
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 dark:text-blue-400"
              >
                GOV.UK guidance
              </a>{" "}
              if unsure.
            </AlertDescription>
          </Alert>

          <GovUKRadio
            name="disqualified"
            legend="Are you disqualified under the Childcare Act 2006?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.disqualified}
            onChange={(value) => setFormData({ ...formData, disqualified: value })}
          />

          {formData.disqualified === "Yes" && (
            <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you are disqualified, we cannot proceed with your application unless you have received a waiver from Ofsted. Please contact us immediately.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You must declare any involvement, including referrals or assessments, even if the case was closed. Past involvement does not automatically disqualify you, but we must explore the circumstances.
            </AlertDescription>
          </Alert>

          <GovUKRadio
            name="socialServices"
            legend="Have you ever been involved with social services in connection with your own children?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.socialServices}
            onChange={(value) => setFormData({ ...formData, socialServices: value })}
          />

          {formData.socialServices === "Yes" && (
            <div className="mt-4">
              <GovUKTextarea
                id="socialServicesInfo"
                label="Please provide details."
                hint="Include dates, the local authority involved, and the outcome."
                required
                rows={5}
                value={formData.socialServicesInfo}
                onChange={(e) => setFormData({ ...formData, socialServicesInfo: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
