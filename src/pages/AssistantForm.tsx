import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssistantFormProgressBar } from "@/components/assistant-form/AssistantFormProgressBar";
import { AssistantConnectionBanner } from "@/components/assistant-form/AssistantConnectionBanner";
import { AssistantFormSection1 } from "@/components/assistant-form/AssistantFormSection1";
import { AssistantFormSection2 } from "@/components/assistant-form/AssistantFormSection2";
import { AssistantFormSection3 } from "@/components/assistant-form/AssistantFormSection3";
import { AssistantFormSection4 } from "@/components/assistant-form/AssistantFormSection4";
import { AssistantFormSection5 } from "@/components/assistant-form/AssistantFormSection5";
import { AssistantFormSection6 } from "@/components/assistant-form/AssistantFormSection6";
import { Button } from "@/components/ui/button";
import { AssistantFormData } from "@/types/assistant";
import {
  validateAssistantSection1,
  validateAssistantSection2,
  validateAssistantSection3,
  validateAssistantSection4,
  validateAssistantSection5,
  validateAssistantSection6,
} from "@/lib/assistantFormValidation";

type AssistantSource = "applicant" | "employee";

export default function AssistantForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [assistantSource, setAssistantSource] = useState<AssistantSource>("applicant");
  
  const [formData, setFormData] = useState<AssistantFormData>({
    title: "", firstName: "", middleNames: "", lastName: "",
    otherNames: "No", previousNames: [],
    dob: "", birthTown: "", sex: "", niNumber: "",
    homeAddressLine1: "", homeAddressLine2: "", homeTown: "", homePostcode: "",
    homeMoveIn: "", addressHistory: [], livedOutsideUK: "No",
    employmentHistory: [], employmentGaps: "",
    pfaCompleted: "", safeguardingCompleted: "",
    prevReg: "No", prevRegInfo: "", hasDBS: "No", dbsNumber: "", dbsUpdate: "",
    offenceHistory: "No", offenceDetails: "", disqualified: "No",
    socialServices: "No", socialServicesInfo: "",
    healthCondition: "No", healthConditionDetails: "", smoker: "",
    consentChecks: false, declarationTruth: false, declarationNotify: false,
    signatureFullName: "", signatureDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing form token");
      navigate("/");
      return;
    }
    loadFormData();
  }, [token]);

  const loadFormData = async () => {
    try {
      console.log("[AssistantForm] Loading form data for token:", token);

      // First, try to find the token in assistant_dbs_tracking (applicant flow)
      const { data: applicantAssistant } = await supabase
        .from("assistant_dbs_tracking")
        .select(`
          *,
          childminder_applications!inner(
            id, first_name, last_name, current_address
          )
        `)
        .eq("form_token", token)
        .maybeSingle();

      if (applicantAssistant) {
        console.log("[AssistantForm] Found token in assistant_dbs_tracking (applicant flow)");
        setAssistantSource("applicant");
        
        setConnectionInfo({
          applicantName: `${applicantAssistant.childminder_applications.first_name} ${applicantAssistant.childminder_applications.last_name}`,
          applicantAddress: applicantAssistant.childminder_applications.current_address,
          assistantName: `${applicantAssistant.first_name} ${applicantAssistant.last_name}`,
          assistantId: applicantAssistant.id,
          applicationId: applicantAssistant.application_id,
        });

        // Load existing form from assistant_forms
        await loadApplicantForm(token!);
        setLoading(false);
        return;
      }

      // If not found in applicant flow, try employee_assistants (employee flow)
      console.log("[AssistantForm] Token not found in applicant flow, trying employee flow");
      
      const { data: employeeAssistant } = await supabase
        .from("employee_assistants")
        .select(`
          *,
          employees!inner(
            id, first_name, last_name, address_line_1, address_line_2, town_city, postcode
          )
        `)
        .eq("form_token", token)
        .maybeSingle();

      if (employeeAssistant) {
        console.log("[AssistantForm] Found token in employee_assistants (employee flow)");
        setAssistantSource("employee");
        
        const employeeAddress = {
          line1: employeeAssistant.employees.address_line_1,
          line2: employeeAssistant.employees.address_line_2,
          town: employeeAssistant.employees.town_city,
          postcode: employeeAssistant.employees.postcode,
        };

        setConnectionInfo({
          applicantName: `${employeeAssistant.employees.first_name} ${employeeAssistant.employees.last_name}`,
          applicantAddress: employeeAddress,
          assistantName: `${employeeAssistant.first_name} ${employeeAssistant.last_name}`,
          assistantId: employeeAssistant.id,
          employeeId: employeeAssistant.employee_id,
        });

        // Load existing form from employee_assistant_forms
        await loadEmployeeForm(token!);
        setLoading(false);
        return;
      }

      // Token not found in either table
      console.error("[AssistantForm] Token not found in either table");
      throw new Error("Form token not found or expired");

    } catch (error: any) {
      console.error("[AssistantForm] Error loading form:", error);
      toast.error(error.message || "Failed to load form");
      navigate("/");
    }
  };

  const loadApplicantForm = async (formToken: string) => {
    const { data: existingForm } = await supabase
      .from("assistant_forms")
      .select("*")
      .eq("form_token", formToken)
      .maybeSingle();

    if (existingForm && existingForm.status !== "submitted") {
      restoreFormData(existingForm);
      toast.success("Draft form loaded");
    }
  };

  const loadEmployeeForm = async (formToken: string) => {
    const { data: existingForm } = await supabase
      .from("employee_assistant_forms")
      .select("*")
      .eq("form_token", formToken)
      .maybeSingle();

    if (existingForm && existingForm.status !== "submitted") {
      restoreFormData(existingForm);
      toast.success("Draft form loaded");
    }
  };

  const restoreFormData = (existingForm: any) => {
    setFormData({
      title: existingForm.title || "",
      firstName: existingForm.first_name || "",
      middleNames: existingForm.middle_names || "",
      lastName: existingForm.last_name || "",
      otherNames: Array.isArray(existingForm.previous_names) && existingForm.previous_names.length > 0 ? "Yes" : "No",
      previousNames: (existingForm.previous_names as any[]) || [],
      dob: existingForm.date_of_birth || "",
      birthTown: existingForm.birth_town || "",
      sex: existingForm.sex || "",
      niNumber: existingForm.ni_number || "",
      homeAddressLine1: (existingForm.current_address as any)?.line1 || (existingForm.current_address as any)?.address_line_1 || "",
      homeAddressLine2: (existingForm.current_address as any)?.line2 || (existingForm.current_address as any)?.address_line_2 || "",
      homeTown: (existingForm.current_address as any)?.town || "",
      homePostcode: (existingForm.current_address as any)?.postcode || "",
      homeMoveIn: (existingForm.current_address as any)?.moveIn || (existingForm.current_address as any)?.move_in_date || "",
      addressHistory: (existingForm.address_history as any[]) || [],
      livedOutsideUK: existingForm.lived_outside_uk || "No",
      employmentHistory: (existingForm.employment_history as any[]) || [],
      employmentGaps: existingForm.employment_gaps || "",
      pfaCompleted: existingForm.pfa_completed || "",
      safeguardingCompleted: existingForm.safeguarding_completed || "",
      prevReg: existingForm.previous_registration || "No",
      prevRegInfo: (existingForm.previous_registration_details as string) || "",
      hasDBS: existingForm.has_dbs || "No",
      dbsNumber: existingForm.dbs_number || "",
      dbsUpdate: existingForm.dbs_update_service || "",
      offenceHistory: existingForm.criminal_history || "No",
      offenceDetails: existingForm.criminal_history_details || "",
      disqualified: existingForm.disqualified || "No",
      socialServices: existingForm.social_services || "No",
      socialServicesInfo: existingForm.social_services_details || "",
      healthCondition: existingForm.health_conditions || "No",
      healthConditionDetails: existingForm.health_conditions_details || "",
      smoker: existingForm.smoker || "",
      consentChecks: existingForm.consent_checks || false,
      declarationTruth: existingForm.declaration_truth || false,
      declarationNotify: existingForm.declaration_notify || false,
      signatureFullName: existingForm.signature_name || "",
      signatureDate: existingForm.signature_date || new Date().toISOString().split('T')[0]
    });
  };

  const validateSection = (section: number): boolean => {
    let result: any;
    
    switch (section) {
      case 0: result = validateAssistantSection1(formData); break;
      case 1: result = validateAssistantSection2(formData); break;
      case 2: result = validateAssistantSection3(formData); break;
      case 3: result = validateAssistantSection4(formData); break;
      case 4: result = validateAssistantSection5(formData); break;
      case 5: result = validateAssistantSection6(formData); break;
      default: return true;
    }

    setValidationErrors(result.errors);
    
    if (!result.isValid) {
      toast.error("Please complete all required fields before continuing");
      setTimeout(() => {
        const firstError = document.querySelector('[aria-invalid="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return false;
    }
    
    return true;
  };

  const saveDraft = async () => {
    if (!token || !connectionInfo) return;

    try {
      const payload = {
        form_token: token,
        status: "draft",
        title: formData.title,
        first_name: formData.firstName,
        middle_names: formData.middleNames,
        last_name: formData.lastName,
        previous_names: formData.otherNames === "Yes" ? formData.previousNames : [],
        date_of_birth: formData.dob || null,
        birth_town: formData.birthTown,
        sex: formData.sex,
        ni_number: formData.niNumber,
        current_address: {
          line1: formData.homeAddressLine1,
          line2: formData.homeAddressLine2,
          town: formData.homeTown,
          postcode: formData.homePostcode,
          moveIn: formData.homeMoveIn
        },
        address_history: formData.addressHistory,
        lived_outside_uk: formData.livedOutsideUK,
        employment_history: formData.employmentHistory,
        employment_gaps: formData.employmentGaps,
        pfa_completed: formData.pfaCompleted,
        safeguarding_completed: formData.safeguardingCompleted,
        previous_registration: formData.prevReg,
        previous_registration_details: formData.prevRegInfo,
        has_dbs: formData.hasDBS,
        dbs_number: formData.dbsNumber,
        dbs_update_service: formData.dbsUpdate,
        criminal_history: formData.offenceHistory,
        criminal_history_details: formData.offenceDetails,
        disqualified: formData.disqualified,
        social_services: formData.socialServices,
        social_services_details: formData.socialServicesInfo,
        health_conditions: formData.healthCondition,
        health_conditions_details: formData.healthConditionDetails,
        smoker: formData.smoker,
        consent_checks: formData.consentChecks,
        declaration_truth: formData.declarationTruth,
        declaration_notify: formData.declarationNotify,
        signature_name: formData.signatureFullName,
        signature_date: formData.signatureDate || null
      };

      if (assistantSource === "employee") {
        // Save to employee_assistant_forms
        const { error } = await supabase
          .from("employee_assistant_forms")
          .upsert({
            ...payload,
            employee_assistant_id: connectionInfo.assistantId,
            employee_id: connectionInfo.employeeId,
          }, { onConflict: "form_token" });

        if (error) throw error;
      } else {
        // Save to assistant_forms
        const { error } = await supabase
          .from("assistant_forms")
          .upsert({
            ...payload,
            assistant_id: connectionInfo.assistantId,
            application_id: connectionInfo.applicationId,
          }, { onConflict: "form_token" });

        if (error) throw error;
      }

      toast.success("Draft saved");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleSubmit = async () => {
    if (!token || !connectionInfo) return;

    if (!validateSection(5)) {
      return;
    }

    setSubmitting(true);
    try {
      await saveDraft();

      const { error } = await supabase.functions.invoke("submit-assistant-form", {
        body: { 
          token, 
          formData,
          isEmployee: assistantSource === "employee"
        }
      });

      if (error) throw error;

      toast.success("Form submitted successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-primary text-primary-foreground border-b-8 border-white no-print">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">Ready Kids</span>
              <span className="text-lg border-l pl-4">Childminder Registration Service</span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="bg-white text-primary hover:bg-gray-100"
            >
              🖨️ Print Form
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-10">
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Suitability Check for Assistants & Staff</h1>
          <p className="text-lg mb-6">
            This is form <strong>CMA-A1</strong>. You have been asked to complete this form because you will be employed 
            by a registered childminder to care for children.
          </p>

          <AssistantConnectionBanner
            applicantName={connectionInfo?.applicantName}
            applicantAddress={connectionInfo?.applicantAddress}
            assistantName={connectionInfo?.assistantName}
          />

          <AssistantFormProgressBar currentSection={currentSection} totalSections={6} />

          {currentSection === 0 && (
            <AssistantFormSection1 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 1 && (
            <AssistantFormSection2 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 2 && (
            <AssistantFormSection3 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 3 && (
            <AssistantFormSection4 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 4 && (
            <AssistantFormSection5 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 5 && (
            <AssistantFormSection6 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}

          <div className="mt-10 pt-6 border-t flex flex-wrap gap-4 justify-between items-center no-print">
            <div className="flex gap-2">
              {currentSection > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentSection(currentSection - 1)}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={saveDraft}
              >
                Save Draft
              </Button>

              {currentSection < 5 ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateSection(currentSection)) {
                      setCurrentSection(currentSection + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Form"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}