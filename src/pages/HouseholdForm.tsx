import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormProgressBar } from "@/components/household-form/FormProgressBar";
import { ConnectionBanner } from "@/components/household-form/ConnectionBanner";
import { HouseholdFormSection1 } from "@/components/household-form/HouseholdFormSection1";
import { HouseholdFormSection2 } from "@/components/household-form/HouseholdFormSection2";
import { HouseholdFormSection3 } from "@/components/household-form/HouseholdFormSection3";
import { HouseholdFormSection4 } from "@/components/household-form/HouseholdFormSection4";
import { HouseholdFormSection5 } from "@/components/household-form/HouseholdFormSection5";
import { Button } from "@/components/ui/button";

export interface HouseholdFormData {
  // Section 1
  title: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  otherNames: string;
  previousNames: Array<{ fullName: string; dateFrom: string; dateTo: string }>;
  dob: string;
  birthTown: string;
  sex: string;
  niNumber: string;
  
  // Section 2
  homeAddressLine1: string;
  homeAddressLine2: string;
  homeTown: string;
  homePostcode: string;
  homeMoveIn: string;
  addressHistory: Array<{ address: string; moveIn: string; moveOut: string }>;
  livedOutsideUK: string;
  outsideUKDetails: string;
  
  // Section 3
  prevReg: string;
  prevRegInfo: string;
  hasDBS: string;
  dbsNumber: string;
  dbsUpdate: string;
  offenceHistory: string;
  offenceDetails: string;
  disqualified: string;
  socialServices: string;
  socialServicesInfo: string;
  
  // Section 4
  healthCondition: string;
  healthConditionDetails: string;
  smoker: string;
  
  // Section 5
  consentChecks: boolean;
  declarationTruth: boolean;
  declarationNotify: boolean;
  signatureFullName: string;
  signatureDate: string;
}

export default function HouseholdForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<HouseholdFormData>({
    title: "", firstName: "", middleNames: "", lastName: "",
    otherNames: "No", previousNames: [],
    dob: "", birthTown: "", sex: "", niNumber: "",
    homeAddressLine1: "", homeAddressLine2: "", homeTown: "", homePostcode: "",
    homeMoveIn: "", addressHistory: [], livedOutsideUK: "No", outsideUKDetails: "",
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
      // Try to load from employee household members first
      const { data: employeeData, error: employeeError } = await supabase
        .from("employee_household_members")
        .select(`
          *,
          employees!inner(
            id, first_name, last_name, address_line_1, town_city, postcode
          )
        `)
        .eq("form_token", token)
        .maybeSingle();

      let memberData: any;
      let isEmployee = false;

      if (employeeData) {
        // Found in employee table
        isEmployee = true;
        memberData = employeeData;
        setConnectionInfo({
          applicantName: `${memberData.employees.first_name} ${memberData.employees.last_name}`,
          applicantAddress: {
            line1: memberData.employees.address_line_1,
            town: memberData.employees.town_city,
            postcode: memberData.employees.postcode
          },
          memberName: memberData.full_name,
          memberId: memberData.id,
          applicationId: memberData.employee_id,
          isEmployee: true
        });
      } else {
        // Try applicant household members table
        const { data: applicantData, error: applicantError } = await supabase
          .from("household_member_dbs_tracking")
          .select(`
            *,
            childminder_applications!inner(
              id, first_name, last_name, current_address
            )
          `)
          .eq("form_token", token)
          .maybeSingle();

        if (!applicantData) {
          throw new Error("Form token not found or expired");
        }

        memberData = applicantData;
        setConnectionInfo({
          applicantName: `${memberData.childminder_applications.first_name} ${memberData.childminder_applications.last_name}`,
          applicantAddress: memberData.childminder_applications.current_address,
          memberName: memberData.full_name,
          memberId: memberData.id,
          applicationId: memberData.application_id,
          isEmployee: false
        });
      }

      // Load existing form submission if any (only for applicants)
      if (!isEmployee) {
        const { data: existingForm } = await supabase
          .from("household_member_forms")
          .select("*")
          .eq("form_token", token)
          .maybeSingle();

        if (existingForm && existingForm.status !== "submitted") {
          // Restore draft
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
            homeAddressLine1: (existingForm.current_address as any)?.line1 || "",
            homeAddressLine2: (existingForm.current_address as any)?.line2 || "",
            homeTown: (existingForm.current_address as any)?.town || "",
            homePostcode: (existingForm.current_address as any)?.postcode || "",
            homeMoveIn: (existingForm.current_address as any)?.moveIn || "",
            addressHistory: (existingForm.address_history as any[]) || [],
            livedOutsideUK: existingForm.lived_outside_uk || "No",
            outsideUKDetails: existingForm.outside_uk_details || "",
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
          toast.success("Draft form loaded");
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error loading form:", error);
      toast.error(error.message || "Failed to load form");
      navigate("/");
    }
  };

  const validateSection = (section: number): boolean => {
    const errors: Record<string, string> = {};

    if (section === 0) {
      if (!formData.title) errors.title = "Select a title";
      if (!formData.firstName.trim()) errors.firstName = "Enter your first name";
      if (!formData.lastName.trim()) errors.lastName = "Enter your last name";
      if (!formData.dob) errors.dob = "Enter your date of birth";
      if (!formData.birthTown.trim()) errors.birthTown = "Enter your town of birth";
      if (!formData.sex) errors.sex = "Select your sex";
      if (!formData.niNumber.trim()) errors.niNumber = "Enter your National Insurance number";
      else if (!/^[A-Z]{2}[0-9]{6}[A-D]$/.test(formData.niNumber.replace(/\s/g, ""))) {
        errors.niNumber = "Enter a valid NI number format (e.g., QQ123456C)";
      }
    } else if (section === 1) {
      if (!formData.homeAddressLine1.trim()) errors.homeAddressLine1 = "Enter address line 1";
      if (!formData.homeTown.trim()) errors.homeTown = "Enter town or city";
      if (!formData.homePostcode.trim()) errors.homePostcode = "Enter postcode";
      if (!formData.homeMoveIn) errors.homeMoveIn = "Enter move in date";
      if (!formData.livedOutsideUK) errors.livedOutsideUK = "Select yes or no";
    } else if (section === 2) {
      if (!formData.prevReg) errors.prevReg = "Select yes or no";
      if (!formData.hasDBS) errors.hasDBS = "Select yes or no";
      if (formData.hasDBS === "Yes" && !formData.dbsNumber.trim()) {
        errors.dbsNumber = "Enter your DBS certificate number";
      }
      if (formData.hasDBS === "Yes" && formData.dbsNumber && !/^\d{12}$/.test(formData.dbsNumber)) {
        errors.dbsNumber = "DBS certificate number must be 12 digits";
      }
      if (!formData.offenceHistory) errors.offenceHistory = "Select yes or no";
      if (!formData.disqualified) errors.disqualified = "Select yes or no";
      if (!formData.socialServices) errors.socialServices = "Select yes or no";
    } else if (section === 3) {
      if (!formData.healthCondition) errors.healthCondition = "Select yes or no";
      if (!formData.smoker) errors.smoker = "Select yes or no";
    } else if (section === 4) {
      if (!formData.consentChecks) errors.consentChecks = "You must consent to checks";
      if (!formData.declarationTruth) errors.declarationTruth = "You must confirm the information is true";
      if (!formData.declarationNotify) errors.declarationNotify = "You must agree to notify of changes";
      if (!formData.signatureFullName.trim()) errors.signatureFullName = "Enter your full name";
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please complete all required fields before continuing");
      // Scroll to first error
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

    // Only save drafts for applicants, not employees
    if (connectionInfo.isEmployee) {
      return;
    }

    try {
      const payload = {
        member_id: connectionInfo.memberId,
        application_id: connectionInfo.applicationId,
        form_token: token,
        status: "draft",
        title: formData.title,
        first_name: formData.firstName,
        middle_names: formData.middleNames,
        last_name: formData.lastName,
        previous_names: formData.otherNames === "Yes" ? formData.previousNames : [],
        date_of_birth: formData.dob,
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
        outside_uk_details: formData.outsideUKDetails,
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
        signature_date: formData.signatureDate
      };

      const { error } = await supabase
        .from("household_member_forms")
        .upsert(payload, { onConflict: "form_token" });

      if (error) throw error;
      toast.success("Draft saved");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleSubmit = async () => {
    if (!token || !connectionInfo) return;

    // Validate final section before submission
    if (!validateSection(4)) {
      return;
    }

    setSubmitting(true);
    try {
      // Save final submission
      await saveDraft();

      // Call submission edge function
      const { error } = await supabase.functions.invoke("submit-household-form", {
        body: { token, formData }
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
          <h1 className="text-4xl font-bold mb-4">Suitability Check for Household Members</h1>
          <p className="text-lg mb-6">
            This is form <strong>CMA-H2</strong>. You have been asked to complete this form because you are aged 16 or over and live or work at a premises where childminding takes place.
          </p>

          <ConnectionBanner
            applicantName={connectionInfo?.applicantName}
            applicantAddress={connectionInfo?.applicantAddress}
            memberName={connectionInfo?.memberName}
          />

          <FormProgressBar currentSection={currentSection} totalSections={5} />

          {currentSection === 0 && (
            <HouseholdFormSection1 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 1 && (
            <HouseholdFormSection2 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 2 && (
            <HouseholdFormSection3 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 3 && (
            <HouseholdFormSection4 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {currentSection === 4 && (
            <HouseholdFormSection5 formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}

          <div className="mt-10 pt-6 border-t flex flex-wrap gap-4 justify-between items-center no-print">
            <div className="flex gap-2">
              {currentSection > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setValidationErrors({});
                    setCurrentSection(currentSection - 1);
                  }}
                >
                  ← Back
                </Button>
              )}
              
              {currentSection < 4 && (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateSection(currentSection)) {
                      saveDraft();
                      setValidationErrors({});
                      setCurrentSection(currentSection + 1);
                    }
                  }}
                >
                  Save and continue →
                </Button>
              )}

              {currentSection === 4 && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[hsl(var(--govuk-green))] hover:bg-[hsl(var(--govuk-green-hover))] text-white font-bold"
                >
                  {submitting ? "Submitting..." : "✓ Submit Form"}
                </Button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
            >
              💾 Save Draft
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
