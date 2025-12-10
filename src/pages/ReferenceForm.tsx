import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ReferenceFormSection1 } from "@/components/reference-form/ReferenceFormSection1";
import { ReferenceFormSection2 } from "@/components/reference-form/ReferenceFormSection2";
import { ReferenceFormSection3 } from "@/components/reference-form/ReferenceFormSection3";
import { ReferenceFormSection4 } from "@/components/reference-form/ReferenceFormSection4";
import { ReferenceFormSection5 } from "@/components/reference-form/ReferenceFormSection5";
import { RKProgressCard, RKSectionNav, RKFormHeader, RKApplyFooter, RKButton } from "@/components/apply/rk";
import { toast } from "sonner";
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react";

interface ReferenceFormData {
  confirmedRelationship: string;
  knownForYears: string;
  characterDescription: string;
  isReliable: "Yes" | "No" | "";
  reliableComments?: string;
  isPatient: "Yes" | "No" | "";
  patientComments?: string;
  hasGoodJudgment: "Yes" | "No" | "";
  judgmentComments?: string;
  observedWithChildren?: "Yes" | "No" | "";
  interactionDescription?: string;
  suitabilityConcerns?: string;
  integrityConcerns: "Yes" | "No" | "";
  integrityConcernsDetails?: string;
  wouldRecommend: "Yes" | "No" | "";
  recommendationComments?: string;
  additionalInformation?: string;
  declarationAccurate: boolean;
  signatureName: string;
  signaturePrintName: string;
  signatureDate: string;
}

const SECTION_LABELS = [
  "Confirmation",
  "Character Assessment",
  "Childcare Suitability",
  "Professional Assessment",
  "Declaration"
];

export default function ReferenceForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [referenceRequest, setReferenceRequest] = useState<any>(null);
  const [applicantName, setApplicantName] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(1);

  const form = useForm<Partial<ReferenceFormData>>({
    defaultValues: {
      declarationAccurate: false,
      confirmedRelationship: "",
      knownForYears: "",
      characterDescription: "",
      isReliable: "",
      isPatient: "",
      hasGoodJudgment: "",
      integrityConcerns: "",
      wouldRecommend: "",
      signatureName: "",
      signaturePrintName: "",
      signatureDate: "",
    }
  });

  const isChildcareReference = referenceRequest?.is_childcare_reference;
  const totalSections = isChildcareReference ? 5 : 4;

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reference link");
      setLoading(false);
      return;
    }

    loadReferenceRequest();
  }, [token]);

  const loadReferenceRequest = async () => {
    try {
      const { data: request, error } = await supabase
        .from("reference_requests")
        .select("*")
        .eq("form_token", token)
        .single();

      if (error || !request) {
        toast.error("Invalid or expired reference link");
        setLoading(false);
        return;
      }

      if (request.request_status === "completed") {
        setAlreadySubmitted(true);
        setCompletedAt(request.response_received_date);
        setLoading(false);
        return;
      }

      setReferenceRequest(request);

      // Get applicant name
      if (request.application_id) {
        const { data: application } = await supabase
          .from("childminder_applications")
          .select("first_name, last_name")
          .eq("id", request.application_id)
          .single();
        
        if (application) {
          setApplicantName(`${application.first_name} ${application.last_name}`);
        }
      } else if (request.employee_id) {
        const { data: employee } = await supabase
          .from("employees")
          .select("first_name, last_name")
          .eq("id", request.employee_id)
          .single();
        
        if (employee) {
          setApplicantName(`${employee.first_name} ${employee.last_name}`);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading reference request:", error);
      toast.error("Failed to load reference request");
      setLoading(false);
    }
  };

  const onSubmit = async (data: Partial<ReferenceFormData>) => {
    if (!data.declarationAccurate) {
      toast.error("You must confirm the declaration");
      return;
    }

    setSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke("submit-reference-form", {
        body: {
          formToken: token,
          responseData: data,
        },
      });

      if (error) throw error;

      toast.success("Reference submitted successfully. Thank you!");
      
      // Show success message
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error: any) {
      console.error("Error submitting reference:", error);
      toast.error(error.message || "Failed to submit reference");
    } finally {
      setSubmitting(false);
    }
  };

  const getActualSectionNumber = (section: number) => {
    // If not childcare reference, skip section 3
    if (!isChildcareReference && section >= 3) {
      return section + 1;
    }
    return section;
  };

  const getSections = () => {
    if (isChildcareReference) {
      return SECTION_LABELS.map((label, i) => ({ id: i + 1, label }));
    }
    // Remove "Childcare Suitability" for non-childcare references
    return SECTION_LABELS.filter((_, i) => i !== 2).map((label, i) => ({ id: i + 1, label }));
  };

  const renderSection = () => {
    const actualSection = getActualSectionNumber(currentSection);
    
    switch (actualSection) {
      case 1:
        return (
          <ReferenceFormSection1 
            form={form} 
            refereeName={referenceRequest?.referee_name || ""}
            applicantName={applicantName}
          />
        );
      case 2:
        return <ReferenceFormSection2 form={form} />;
      case 3:
        return (
          <ReferenceFormSection3 
            form={form} 
            isChildcareReference={isChildcareReference}
          />
        );
      case 4:
        return <ReferenceFormSection4 form={form} />;
      case 5:
        return <ReferenceFormSection5 form={form} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reference form...</p>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md text-center border">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Already Submitted</h1>
          <p className="text-muted-foreground mb-4">
            This reference has already been submitted
            {completedAt && ` on ${new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}.
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you for providing the reference. No further action is required.
          </p>
        </div>
      </div>
    );
  }

  if (!referenceRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md text-center border">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reference Link</h1>
          <p className="text-muted-foreground">
            This reference link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <RKFormHeader 
        title="Reference Form" 
        subtitle={`Providing reference for ${applicantName}`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <RKProgressCard
              currentSection={currentSection}
              totalSections={totalSections}
            />
            
            <RKSectionNav
              sections={getSections()}
              currentSection={currentSection}
              onSectionClick={setCurrentSection}
            />
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-2xl shadow-lg border p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderSection()}
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <RKButton
              type="button"
              variant="secondary"
              onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
              disabled={currentSection === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </RKButton>

            <span className="text-sm text-muted-foreground">
              Section {currentSection} of {totalSections}
            </span>

            {currentSection < totalSections ? (
              <RKButton
                type="button"
                onClick={() => setCurrentSection(prev => Math.min(totalSections, prev + 1))}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </RKButton>
            ) : (
              <RKButton
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit Reference"}
              </RKButton>
            )}
          </div>
        </div>
      </div>

      <RKApplyFooter />
    </div>
  );
}