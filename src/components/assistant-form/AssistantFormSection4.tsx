import { AssistantFormData } from "@/types/assistant";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { GovUKRadio } from "@/components/apply/GovUKRadio";
import { GovUKTextarea } from "@/components/apply/GovUKTextarea";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection4({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">4. Vetting & Suitability</h2>
      <p className="text-base mb-6 text-muted-foreground">
        This section covers mandatory background checks required for anyone living or working in a childminding setting.
      </p>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Previous Registrations</h3>
        
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
          error={validationErrors.prevReg}
        />

        {formData.prevReg === "Yes" && (
          <GovUKTextarea
            id="prevRegInfo"
            label="Please provide details"
            hint="Include regulator name, registration number, dates, and current status"
            required
            value={formData.prevRegInfo}
            onChange={(e) => setFormData({ ...formData, prevRegInfo: e.target.value })}
            rows={4}
          />
        )}

        <div className="border-t pt-6 mt-8">
          <h3 className="text-2xl font-bold mb-4">DBS (Disclosure and Barring Service)</h3>
          
          <GovUKRadio
            name="hasDBS"
            legend="Do you have a DBS Enhanced Certificate for the Children's and Adults' Barred Lists?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.hasDBS}
            onChange={(value) => setFormData({ ...formData, hasDBS: value })}
            error={validationErrors.hasDBS}
          />

          {formData.hasDBS === "Yes" && (
            <div className="space-y-6 mt-4">
              <GovUKInput
                id="dbsNumber"
                label="DBS certificate number"
                hint="This is a 12-digit number on your certificate"
                required
                validationType="dbs-certificate"
                value={formData.dbsNumber}
                onChange={(e) => setFormData({ ...formData, dbsNumber: e.target.value })}
                error={validationErrors.dbsNumber}
              />

              <GovUKRadio
                name="dbsUpdate"
                legend="Are you registered with the DBS Update Service?"
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]}
                value={formData.dbsUpdate}
                onChange={(value) => setFormData({ ...formData, dbsUpdate: value })}
                error={validationErrors.dbsUpdate}
              />
            </div>
          )}
        </div>

        <div className="border-t pt-6 mt-8">
          <h3 className="text-2xl font-bold mb-4">Criminal History & Suitability</h3>
          
          <GovUKRadio
            name="offenceHistory"
            legend="Have you ever been convicted of any criminal offence, received a police caution, reprimand, or warning?"
            hint="Include spent and unspent convictions"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.offenceHistory}
            onChange={(value) => setFormData({ ...formData, offenceHistory: value })}
            error={validationErrors.offenceHistory}
          />

          {formData.offenceHistory === "Yes" && (
            <GovUKTextarea
              id="offenceDetails"
              label="Please provide full details"
              hint="Include dates, offences, and outcomes"
              required
              value={formData.offenceDetails}
              onChange={(e) => setFormData({ ...formData, offenceDetails: e.target.value })}
              rows={4}
            />
          )}

          <GovUKRadio
            name="disqualified"
            legend="Have you ever been disqualified from working with children or subject to any safeguarding orders?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.disqualified}
            onChange={(value) => setFormData({ ...formData, disqualified: value })}
            error={validationErrors.disqualified}
          />

          <GovUKRadio
            name="socialServices"
            legend="Have you or any member of your household been investigated or had action taken by social services in relation to child protection?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.socialServices}
            onChange={(value) => setFormData({ ...formData, socialServices: value })}
            error={validationErrors.socialServices}
          />

          {formData.socialServices === "Yes" && (
            <GovUKTextarea
              id="socialServicesInfo"
              label="Please provide full details"
              required
              value={formData.socialServicesInfo}
              onChange={(e) => setFormData({ ...formData, socialServicesInfo: e.target.value })}
              rows={4}
            />
          )}
        </div>
      </div>
    </div>
  );
}
