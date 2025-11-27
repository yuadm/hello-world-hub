import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Save, X, ArrowRight, Download, User, Home, FileText, Briefcase, GraduationCap, Users, Shield, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdf } from '@react-pdf/renderer';
import { ApplicationPDF } from "@/components/admin/ApplicationPDF";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChildminderApplication } from "@/types/childminder";
import { ProgressBar } from "@/components/apply/ProgressBar";
import { ErrorSummary } from "@/components/apply/ErrorSummary";
import { GovUKButton } from "@/components/apply/GovUKButton";
import { Section1PersonalDetails } from "@/components/apply/Section1PersonalDetails";
import { Section2AddressHistory } from "@/components/apply/Section2AddressHistory";
import { Section3Premises } from "@/components/apply/Section3Premises";
import { Section4Service } from "@/components/apply/Section4Service";
import { Section5Qualifications } from "@/components/apply/Section5Qualifications";
import { Section6Employment } from "@/components/apply/Section6Employment";
import { Section7People } from "@/components/apply/Section7People";
import { Section8Suitability } from "@/components/apply/Section8Suitability";
import { Section9Declaration } from "@/components/apply/Section9Declaration";
import { getValidatorForSection } from "@/lib/formValidation";
import { DBSComplianceSection } from "@/components/admin/DBSComplianceSection";
import { AssistantComplianceSection } from "@/components/admin/AssistantComplianceSection";
import { RequestApplicantDBSModal } from "@/components/admin/RequestApplicantDBSModal";
import AdminLayout from "@/components/admin/AdminLayout";

interface DBApplication {
  id: string;
  title: string;
  first_name: string;
  middle_names: string;
  last_name: string;
  place_of_birth: string;
  email: string;
  phone_mobile: string;
  phone_home: string;
  date_of_birth: string;
  gender: string;
  national_insurance_number: string;
  status: string;
  created_at: string;
  current_address: any;
  address_history: any;
  premises_address: any;
  service_type: string;
  service_age_range: any;
  service_capacity: any;
  service_hours: any;
  service_local_authority: string;
  service_ofsted_registered: string;
  service_ofsted_number: string;
  employment_history: any;
  qualifications: any;
  training_courses: any;
  people_in_household: any;
  people_regular_contact: any;
  previous_names: any;
  health_conditions: string;
  health_details: string;
  criminal_convictions: string;
  convictions_details: string;
  safeguarding_concerns: string;
  safeguarding_details: string;
  previous_registration: string;
  registration_details: any;
  premises_ownership: string;
  premises_animals: string;
  premises_animal_details: string;
  premises_landlord_details: any;
  premises_other_residents: any;
  declaration_confirmed: boolean;
  declaration_date: string;
  declaration_signature: string;
  user_id: string;
  updated_at: string;
  right_to_work: string;
  home_postcode: string;
  home_move_in: string;
  address_gaps: string;
  lived_outside_uk: string;
  military_base: string;
  same_address: string;
  use_additional_premises: string;
  additional_premises: any;
  outdoor_space: string;
  work_with_others: string;
  number_of_assistants: number;
  overnight_care: string;
  employment_gaps: string;
  child_volunteered: string;
  child_volunteered_consent: boolean;
  applicant_references: any;
  adults_in_home: string;
  children_in_home: string;
  prev_reg_agency: string;
  prev_reg_other_uk: string;
  prev_reg_eu: string;
  smoker: string;
  disqualified: string;
  other_circumstances: string;
  other_circumstances_details: string;
  has_dbs: string;
  dbs_number: string;
  dbs_enhanced: string;
  dbs_update: string;
  declaration_change_notification: boolean;
  declaration_inspection_cooperation: boolean;
  declaration_information_sharing: boolean;
  declaration_data_processing: boolean;
  payment_method: string;
}

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [dbApplication, setDbApplication] = useState<DBApplication | null>(null);
  const [existingEmployeeId, setExistingEmployeeId] = useState<string | null>(null);
  const [isApplicantDBSModalOpen, setIsApplicantDBSModalOpen] = useState(false);
  const totalSections = 9;

  const form = useForm<Partial<ChildminderApplication>>({
    defaultValues: {
      previousNames: [],
      addressHistory: [],
      additionalPremises: [],
      ageGroups: [],
      childcareTimes: [],
      employmentHistory: [],
      assistants: [],
      adults: [],
      children: [],
      prevRegOfstedDetails: [],
      prevRegAgencyDetails: [],
      prevRegOtherUKDetails: [],
      prevRegEUDetails: [],
      offenceDetails: [],
    },
  });

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const mapDBToForm = (data: DBApplication): Partial<ChildminderApplication> => {
    const qualifications = data.qualifications || {};
    const serviceCapacity = data.service_capacity || {};
    const peopleInHousehold = data.people_in_household || {};
    const registrationDetails = data.registration_details || {};
    const references = data.applicant_references || {};

    return {
      title: data.title,
      firstName: data.first_name,
      middleNames: data.middle_names,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone_mobile,
      dob: data.date_of_birth,
      gender: data.gender as any,
      niNumber: data.national_insurance_number,
      previousNames: data.previous_names || [],
      rightToWork: data.right_to_work,
      homePostcode: data.home_postcode,
      homeAddress: data.current_address,
      homeMoveIn: data.home_move_in,
      addressHistory: data.address_history || [],
      addressGaps: data.address_gaps,
      livedOutsideUK: data.lived_outside_uk as any,
      militaryBase: data.military_base as any,
      localAuthority: data.service_local_authority,
      sameAddress: data.same_address as any,
      childcareAddress: data.premises_address,
      premisesType: data.premises_ownership as any,
      useAdditionalPremises: data.use_additional_premises as any,
      additionalPremises: data.additional_premises || [],
      outdoorSpace: data.outdoor_space as any,
      pets: data.premises_animals as any,
      petsDetails: data.premises_animal_details,
      ageGroups: data.service_age_range || [],
      workWithOthers: data.work_with_others as any,
      numberOfAssistants: data.number_of_assistants,
      proposedUnder1: serviceCapacity.under1,
      proposedUnder5: serviceCapacity.under5,
      proposed5to8: serviceCapacity.ages5to8,
      proposed8plus: serviceCapacity.ages8plus,
      childcareTimes: data.service_hours || [],
      overnightCare: data.overnight_care as any,
      firstAid: qualifications.firstAid || { completed: "No" },
      safeguarding: qualifications.safeguarding,
      eyfsChildminding: qualifications.eyfsChildminding,
      level2Qual: qualifications.level2Qual,
      employmentHistory: data.employment_history || [],
      employmentGaps: data.employment_gaps,
      childVolunteered: data.child_volunteered as any,
      childVolunteeredConsent: data.child_volunteered_consent,
      reference1Name: references.reference1?.name,
      reference1Relationship: references.reference1?.relationship,
      reference1Contact: references.reference1?.contact,
      reference1Childcare: references.reference1?.childcare as any,
      reference2Name: references.reference2?.name,
      reference2Relationship: references.reference2?.relationship,
      reference2Contact: references.reference2?.contact,
      reference2Childcare: references.reference2?.childcare as any,
      assistants: data.people_regular_contact || [],
      adultsInHome: data.adults_in_home as any,
      adults: peopleInHousehold.adults || [],
      childrenInHome: data.children_in_home as any,
      children: peopleInHousehold.children || [],
      prevRegOfsted: data.previous_registration as any,
      prevRegOfstedDetails: registrationDetails.ofsted || [],
      prevRegAgency: data.prev_reg_agency as any,
      prevRegAgencyDetails: registrationDetails.agency || [],
      prevRegOtherUK: data.prev_reg_other_uk as any,
      prevRegOtherUKDetails: registrationDetails.otherUK || [],
      prevRegEU: data.prev_reg_eu as any,
      prevRegEUDetails: registrationDetails.eu || [],
      healthCondition: data.health_conditions as any,
      healthConditionDetails: data.health_details,
      smoker: data.smoker as any,
      disqualified: data.disqualified as any,
      socialServices: data.safeguarding_concerns as any,
      socialServicesDetails: data.safeguarding_details,
      otherCircumstances: data.other_circumstances as any,
      otherCircumstancesDetails: data.other_circumstances_details,
      hasDBS: data.has_dbs as any,
      dbsNumber: data.dbs_number,
      dbsEnhanced: data.dbs_enhanced as any,
      dbsUpdate: data.dbs_update as any,
      offenceHistory: data.criminal_convictions as any,
      offenceDetails: data.convictions_details ? JSON.parse(data.convictions_details) : [],
      declarationAccuracy: data.declaration_confirmed,
      declarationChangeNotification: data.declaration_change_notification,
      declarationInspectionCooperation: data.declaration_inspection_cooperation,
      declarationInformationSharing: data.declaration_information_sharing,
      declarationDataProcessing: data.declaration_data_processing,
      signatureFullName: data.declaration_signature,
      signatureDate: data.declaration_date,
      paymentMethod: data.payment_method,
    };
  };

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('childminder_applications' as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Not Found",
          description: "Application not found",
          variant: "destructive",
        });
        navigate('/admin/applications');
        return;
      }

      setDbApplication(data as unknown as DBApplication);
      
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id')
        .eq('application_id', id)
        .maybeSingle();

      if (employeeData) {
        setExistingEmployeeId(employeeData.id);
      }
      
      const formData = mapDBToForm(data as unknown as DBApplication);
      form.reset(formData);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      if (newStatus === 'approved') {
        const { data, error } = await supabase.functions.invoke('approve-and-convert-to-employee', {
          body: { applicationId: id },
        });

        if (error) throw error;

        if (data?.success) {
          setDbApplication(prev => prev ? { ...prev, status: newStatus } : null);
          
          if (data.alreadyExists) {
            setExistingEmployeeId(data.employeeId);
            toast({
              title: "Already Approved",
              description: data.message,
              action: (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/employees/${data.employeeId}`)}
                >
                  View Employee
                </Button>
              ),
            });
          } else {
            setExistingEmployeeId(data.employeeId);
            toast({
              title: "Application Approved",
              description: `Applicant successfully converted to employee. ${data.householdMembersCount} household members transferred.`,
              action: (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/employees/${data.employeeId}`)}
                >
                  View Employee
                </Button>
              ),
            });
          }
        } else {
          throw new Error('Failed to convert applicant to employee');
        }
      } else {
        const { error } = await supabase
          .from('childminder_applications' as any)
          .update({ status: newStatus })
          .eq('id', id);

        if (error) throw error;

        setDbApplication(prev => prev ? { ...prev, status: newStatus } : null);
        toast({
          title: "Status Updated",
          description: `Application ${newStatus}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const nextSection = () => {
    const validator = getValidatorForSection(currentSection);
    const validation = validator(form.getValues());
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setErrors([]);
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    setErrors([]);
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveChanges = async () => {
    const allErrors: string[] = [];
    for (let section = 1; section <= totalSections; section++) {
      const validator = getValidatorForSection(section);
      const validation = validator(form.getValues());
      if (!validation.isValid) {
        allErrors.push(...validation.errors.map(err => `Section ${section}: ${err}`));
      }
    }

    if (allErrors.length > 0) {
      setErrors(allErrors);
      setCurrentSection(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setUpdating(true);
    try {
      const data = form.getValues();
      
      const { error } = await supabase
        .from('childminder_applications' as any)
        .update({
          title: data.title,
          first_name: data.firstName,
          middle_names: data.middleNames,
          last_name: data.lastName,
          gender: data.gender,
          date_of_birth: data.dob,
          previous_names: data.previousNames,
          national_insurance_number: data.niNumber,
          email: data.email,
          phone_mobile: data.phone,
          right_to_work: data.rightToWork,
          home_postcode: data.homePostcode,
          current_address: data.homeAddress,
          home_move_in: data.homeMoveIn,
          address_history: data.addressHistory,
          address_gaps: data.addressGaps,
          lived_outside_uk: data.livedOutsideUK,
          military_base: data.militaryBase,
          same_address: data.sameAddress,
          premises_address: data.childcareAddress || data.homeAddress,
          premises_ownership: data.premisesType,
          use_additional_premises: data.useAdditionalPremises,
          additional_premises: data.additionalPremises,
          outdoor_space: data.outdoorSpace,
          premises_animals: data.pets,
          premises_animal_details: data.petsDetails,
          service_type: data.premisesType,
          service_age_range: data.ageGroups,
          work_with_others: data.workWithOthers,
          number_of_assistants: data.numberOfAssistants,
          service_capacity: {
            under1: data.proposedUnder1,
            under5: data.proposedUnder5,
            ages5to8: data.proposed5to8,
            ages8plus: data.proposed8plus
          },
          service_hours: data.childcareTimes,
          overnight_care: data.overnightCare,
          service_local_authority: data.localAuthority,
          qualifications: {
            firstAid: data.firstAid,
            safeguarding: data.safeguarding,
            eyfsChildminding: data.eyfsChildminding,
            level2Qual: data.level2Qual
          },
          employment_history: data.employmentHistory,
          employment_gaps: data.employmentGaps,
          child_volunteered: data.childVolunteered,
          child_volunteered_consent: data.childVolunteeredConsent,
          applicant_references: {
            reference1: {
              name: data.reference1Name,
              relationship: data.reference1Relationship,
              contact: data.reference1Contact,
              childcare: data.reference1Childcare
            },
            reference2: {
              name: data.reference2Name,
              relationship: data.reference2Relationship,
              contact: data.reference2Contact,
              childcare: data.reference2Childcare
            }
          },
          people_in_household: {
            adults: data.adults,
            children: data.children
          },
          adults_in_home: data.adultsInHome,
          children_in_home: data.childrenInHome,
          people_regular_contact: data.assistants,
          previous_registration: data.prevRegOfsted,
          prev_reg_agency: data.prevRegAgency,
          prev_reg_other_uk: data.prevRegOtherUK,
          prev_reg_eu: data.prevRegEU,
          registration_details: {
            ofsted: data.prevRegOfstedDetails,
            agency: data.prevRegAgencyDetails,
            otherUK: data.prevRegOtherUKDetails,
            eu: data.prevRegEUDetails
          },
          health_conditions: data.healthCondition,
          health_details: data.healthConditionDetails,
          smoker: data.smoker,
          disqualified: data.disqualified,
          other_circumstances: data.otherCircumstances,
          other_circumstances_details: data.otherCircumstancesDetails,
          has_dbs: data.hasDBS,
          dbs_number: data.dbsNumber,
          dbs_enhanced: data.dbsEnhanced,
          dbs_update: data.dbsUpdate,
          criminal_convictions: data.offenceHistory,
          convictions_details: data.offenceDetails ? JSON.stringify(data.offenceDetails) : null,
          safeguarding_concerns: data.socialServices,
          safeguarding_details: data.socialServicesDetails,
          declaration_confirmed: data.declarationAccuracy,
          declaration_change_notification: data.declarationChangeNotification,
          declaration_inspection_cooperation: data.declarationInspectionCooperation,
          declaration_information_sharing: data.declarationInformationSharing,
          declaration_data_processing: data.declarationDataProcessing,
          declaration_signature: data.signatureFullName,
          declaration_date: data.signatureDate,
          payment_method: data.paymentMethod,
        } as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Changes Saved",
        description: "Application updated successfully",
      });
      
      setIsEditMode(false);
      setCurrentSection(1);
      fetchApplication();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const formData = form.getValues();
      const blob = await pdf(
        <ApplicationPDF 
          application={formData}
          applicationId={id || ''}
          submittedDate={dbApplication?.created_at || ''}
          status={dbApplication?.status || 'pending'}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `application-${formData.firstName}-${formData.lastName}-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Downloaded",
        description: "Application has been downloaded successfully",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; icon: any }> = {
      pending: { bg: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200", icon: Clock },
      approved: { bg: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
      rejected: { bg: "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200", icon: AlertCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`rounded-xl px-4 py-2 text-sm font-medium border ${config.bg}`}>
        <Icon className="h-4 w-4 mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <Section1PersonalDetails form={form} />;
      case 2:
        return <Section2AddressHistory form={form} />;
      case 3:
        return <Section3Premises form={form} />;
      case 4:
        return <Section4Service form={form} />;
      case 5:
        return <Section5Qualifications form={form} />;
      case 6:
        return <Section6Employment form={form} />;
      case 7:
        return <Section7People form={form} />;
      case 8:
        return <Section8Suitability form={form} />;
      case 9:
        return <Section9Declaration form={form} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 w-48 bg-muted rounded-lg animate-shimmer" />
          <div className="grid gap-6">
            <div className="h-48 bg-muted rounded-xl animate-shimmer" />
            <div className="h-96 bg-muted rounded-xl animate-shimmer" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!dbApplication) {
    return null;
  }

  if (isEditMode) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-[hsl(var(--govuk-grey-background))] -mx-4 -my-8">
          <header className="bg-[hsl(var(--govuk-black))] text-white border-b-[10px] border-white">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-4">Ready Kids</span>
                  <span className="text-lg border-l pl-4 border-white/30">
                    Edit Application
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setIsEditMode(false);
                    setCurrentSection(1);
                    setErrors([]);
                    fetchApplication();
                  }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-6">
            <p className="text-sm">
              <button onClick={() => navigate('/admin/applications')} className="underline text-primary hover:text-primary/80">
                Back to applications
              </button>
            </p>
          </div>

          <main className="container mx-auto px-4 md:px-8 pb-16">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 shadow-lg">
              <h1 className="text-4xl font-extrabold mb-6 leading-tight text-foreground">
                Edit Application
              </h1>

              <ErrorSummary errors={errors} onClose={() => setErrors([])} />

              <ProgressBar currentSection={currentSection} totalSections={totalSections} />

            <form onSubmit={(e) => e.preventDefault()} noValidate>
              {renderSection()}

              <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                {currentSection > 1 && (
                  <GovUKButton
                    type="button"
                    variant="secondary"
                    onClick={prevSection}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </GovUKButton>
                )}

                {currentSection < totalSections ? (
                  <GovUKButton
                    type="button"
                    variant="primary"
                    onClick={nextSection}
                    className="flex items-center gap-2 ml-auto"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </GovUKButton>
                ) : (
                  <GovUKButton
                    type="button"
                    variant="primary"
                    onClick={saveChanges}
                    disabled={updating}
                    className="ml-auto flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updating ? "Saving..." : "Save Changes"}
                  </GovUKButton>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
      </AdminLayout>
    );
  }

  // View Mode - NEW MODERN DESIGN
  const formData = form.getValues();
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/applications')}
              className="mb-2 -ml-2 hover:bg-muted/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {dbApplication.first_name} {dbApplication.last_name}
              </h1>
              <p className="text-muted-foreground text-lg mt-1">{dbApplication.email}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start flex-wrap">
            {getStatusBadge(dbApplication.status)}
            
            {existingEmployeeId && (
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/employees/${existingEmployeeId}`)}
                className="rounded-xl"
              >
                View Employee Record
              </Button>
            )}
            
            <Select 
              value={dbApplication.status} 
              onValueChange={updateStatus} 
              disabled={updating || existingEmployeeId !== null}
            >
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setIsEditMode(true)} 
              disabled={existingEmployeeId !== null}
              className="rounded-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button 
              onClick={handleDownloadPDF} 
              variant="secondary"
              className="rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {existingEmployeeId && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Status cannot be changed after conversion to employee
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-muted/50 p-2 rounded-xl h-auto">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Address</span>
            </TabsTrigger>
            <TabsTrigger value="service" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Service</span>
            </TabsTrigger>
            <TabsTrigger value="qualifications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="employment" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="household" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">People</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Personal Info</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-950 dark:text-blue-50">
                    {formData.gender}, {formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 'N/A'} years
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    DOB: {formData.dob ? format(new Date(formData.dob), "MMM dd, yyyy") : "N/A"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Location</h3>
                  </div>
                  <p className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                    {formData.localAuthority || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.homeAddress?.town || "N/A"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Capacity</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-950 dark:text-purple-50">
                    {(formData.proposedUnder1 || 0) + (formData.proposedUnder5 || 0) + (formData.proposed5to8 || 0) + (formData.proposed8plus || 0)} children
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.premisesType || "N/A"} premises
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Quick Summary</h2>
                <dl className="grid md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Full Name</dt>
                    <dd className="text-lg font-medium">{formData.title} {formData.firstName} {formData.middleNames} {formData.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Contact</dt>
                    <dd className="text-lg">{formData.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">NI Number</dt>
                    <dd className="text-lg font-mono">{formData.niNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Submitted</dt>
                    <dd className="text-lg">{format(new Date(dbApplication.created_at), "MMM dd, yyyy")}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Details Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  Personal Details
                </h2>
                <dl className="grid md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Title</dt>
                    <dd className="text-lg">{formData.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">First Name</dt>
                    <dd className="text-lg">{formData.firstName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Middle Names</dt>
                    <dd className="text-lg">{formData.middleNames || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Last Name</dt>
                    <dd className="text-lg">{formData.lastName}</dd>
                  </div>
                  {formData.previousNames && formData.previousNames.length > 0 && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground mb-2">Previous Names</dt>
                      <dd className="space-y-2">
                        {formData.previousNames.map((name: any, idx: number) => (
                          <Card key={idx} className="bg-muted/30">
                            <CardContent className="p-4">
                              <p className="font-medium">{name.fullName}</p>
                              <p className="text-sm text-muted-foreground">{name.dateFrom} to {name.dateTo}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Gender</dt>
                    <dd className="text-lg">{formData.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</dt>
                    <dd className="text-lg">{formData.dob ? format(new Date(formData.dob), "MMMM dd, yyyy") : "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Place of Birth</dt>
                    <dd className="text-lg">{dbApplication.place_of_birth || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Right to Work</dt>
                    <dd className="text-lg">{(formData as any).rightToWork || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">National Insurance</dt>
                    <dd className="text-lg font-mono">{formData.niNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Email</dt>
                    <dd className="text-lg">{formData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Mobile Phone</dt>
                    <dd className="text-lg">{formData.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Home Phone</dt>
                    <dd className="text-lg">{dbApplication.phone_home || "N/A"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Home className="h-6 w-6 text-primary" />
                  Current Address
                </h2>
                <div className="space-y-4">
                  <div className="p-6 bg-primary/5 rounded-xl">
                    <p className="text-lg font-medium mb-2">{formData.homeAddress?.line1}</p>
                    {formData.homeAddress?.line2 && <p className="text-muted-foreground">{formData.homeAddress.line2}</p>}
                    <p className="text-muted-foreground">{formData.homeAddress?.town}</p>
                    <p className="text-lg font-semibold mt-2">{formData.homeAddress?.postcode}</p>
                    <p className="text-sm text-muted-foreground mt-3">Moved in: {(formData as any).homeMoveIn || "N/A"}</p>
                  </div>
                  
                  <dl className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">Lived Outside UK</dt>
                      <dd className="text-lg">{(formData as any).livedOutsideUK || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">Military Base</dt>
                      <dd className="text-lg">{(formData as any).militaryBase || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>

            {formData.addressHistory && formData.addressHistory.length > 0 && (
              <Card className="border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">5 Year Address History</h3>
                  <div className="space-y-3">
                    {formData.addressHistory.map((addr: any, idx: number) => (
                      <Card key={idx} className="bg-muted/30">
                        <CardContent className="p-4">
                          <p className="font-medium">{addr.address?.line1}, {addr.address?.town}, {addr.address?.postcode}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.moveIn} → {addr.moveOut}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {(formData as any).addressGaps && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">Address Gaps Explanation</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{(formData as any).addressGaps}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Childcare Premises</h3>
                <dl className="grid md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Local Authority</dt>
                    <dd className="text-lg">{formData.localAuthority}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Premises Type</dt>
                    <dd className="text-lg">{formData.premisesType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Same as Home Address</dt>
                    <dd className="text-lg">{(formData as any).sameAddress || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Outdoor Space</dt>
                    <dd className="text-lg">{(formData as any).outdoorSpace || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Pets</dt>
                    <dd className="text-lg">{formData.pets}</dd>
                  </div>
                  {formData.petsDetails && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground mb-1">Pet Details</dt>
                      <dd className="text-lg">{formData.petsDetails}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Tab */}
          <TabsContent value="service" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Service Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Age Groups</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.ageGroups?.map((group, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Proposed Capacity</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-muted/30 rounded">
                        <dt>Under 1:</dt>
                        <dd className="font-semibold">{formData.proposedUnder1 || 0}</dd>
                      </div>
                      <div className="flex justify-between p-2 bg-muted/30 rounded">
                        <dt>Under 5:</dt>
                        <dd className="font-semibold">{formData.proposedUnder5 || 0}</dd>
                      </div>
                      <div className="flex justify-between p-2 bg-muted/30 rounded">
                        <dt>5-8 years:</dt>
                        <dd className="font-semibold">{formData.proposed5to8 || 0}</dd>
                      </div>
                      <div className="flex justify-between p-2 bg-muted/30 rounded">
                        <dt>8+ years:</dt>
                        <dd className="font-semibold">{formData.proposed8plus || 0}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Work With Others</dt>
                    <dd className="text-lg">{(formData as any).workWithOthers || "N/A"}</dd>
                  </div>
                  {(formData as any).workWithOthers === "Yes" && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">Number of Assistants</dt>
                      <dd className="text-lg">{(formData as any).numberOfAssistants || 0}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">Overnight Care</dt>
                    <dd className="text-lg">{(formData as any).overnightCare || "N/A"}</dd>
                  </div>
                  {formData.childcareTimes && formData.childcareTimes.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground mb-1">Childcare Times</dt>
                      <dd className="flex flex-wrap gap-2 mt-2">
                        {formData.childcareTimes.map((time, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {time}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {formData.assistants && formData.assistants.length > 0 && (
              <Card className="border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Assistants & Co-childminders</h3>
                  <div className="grid gap-4">
                    {formData.assistants.map((person: any, idx: number) => (
                      <Card key={idx} className="bg-muted/30">
                        <CardContent className="p-4">
                          <p className="font-medium text-lg">{person.firstName} {person.lastName}</p>
                          <div className="grid md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                            <p>Role: {person.role || "N/A"}</p>
                            <p>DOB: {person.dob || "N/A"}</p>
                            <p>Email: {person.email || "N/A"}</p>
                            <p>Phone: {person.phone || "N/A"}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Qualifications Tab */}
          <TabsContent value="qualifications" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Qualifications & Training
                </h2>
                
                <div className="space-y-6">
                  {/* First Aid */}
                  <Card className={`${formData.firstAid?.completed === "Yes" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200" : "bg-muted/30"}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">First Aid Training</h3>
                        <Badge variant={formData.firstAid?.completed === "Yes" ? "default" : "secondary"}>
                          {formData.firstAid?.completed || "No"}
                        </Badge>
                      </div>
                      {formData.firstAid?.completed === "Yes" && (
                        <dl className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <dt className="text-muted-foreground mb-1">Provider</dt>
                            <dd className="font-medium">{formData.firstAid.provider || "N/A"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground mb-1">Completion Date</dt>
                            <dd className="font-medium">{formData.firstAid.completionDate || "N/A"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground mb-1">Certificate Number</dt>
                            <dd className="font-medium font-mono">{formData.firstAid.certificateNumber || "N/A"}</dd>
                          </div>
                        </dl>
                      )}
                    </CardContent>
                  </Card>

                  {/* Safeguarding */}
                  {formData.safeguarding && (
                    <Card className={`${formData.safeguarding?.completed === "Yes" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200" : "bg-muted/30"}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold">Safeguarding Training</h3>
                          <Badge variant={formData.safeguarding?.completed === "Yes" ? "default" : "secondary"}>
                            {formData.safeguarding?.completed || "No"}
                          </Badge>
                        </div>
                        {formData.safeguarding?.completed === "Yes" && (
                          <dl className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <dt className="text-muted-foreground mb-1">Provider</dt>
                              <dd className="font-medium">{formData.safeguarding.provider || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Completion Date</dt>
                              <dd className="font-medium">{formData.safeguarding.completionDate || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Certificate Number</dt>
                              <dd className="font-medium font-mono">{formData.safeguarding.certificateNumber || "N/A"}</dd>
                            </div>
                          </dl>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* EYFS */}
                  {formData.eyfsChildminding && (
                    <Card className={`${formData.eyfsChildminding?.completed === "Yes" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200" : "bg-muted/30"}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold">EYFS/Childminding Course</h3>
                          <Badge variant={formData.eyfsChildminding?.completed === "Yes" ? "default" : "secondary"}>
                            {formData.eyfsChildminding?.completed || "No"}
                          </Badge>
                        </div>
                        {formData.eyfsChildminding?.completed === "Yes" && (
                          <dl className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <dt className="text-muted-foreground mb-1">Provider</dt>
                              <dd className="font-medium">{formData.eyfsChildminding.provider || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Completion Date</dt>
                              <dd className="font-medium">{formData.eyfsChildminding.completionDate || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Certificate Number</dt>
                              <dd className="font-medium font-mono">{formData.eyfsChildminding.certificateNumber || "N/A"}</dd>
                            </div>
                          </dl>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Level 2 */}
                  {formData.level2Qual && (
                    <Card className={`${formData.level2Qual?.completed === "Yes" ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200" : "bg-muted/30"}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold">Level 2 Qualification</h3>
                          <Badge variant={formData.level2Qual?.completed === "Yes" ? "default" : "secondary"}>
                            {formData.level2Qual?.completed || "No"}
                          </Badge>
                        </div>
                        {formData.level2Qual?.completed === "Yes" && (
                          <dl className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <dt className="text-muted-foreground mb-1">Provider</dt>
                              <dd className="font-medium">{formData.level2Qual.provider || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Completion Date</dt>
                              <dd className="font-medium">{formData.level2Qual.completionDate || "N/A"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground mb-1">Certificate Number</dt>
                              <dd className="font-medium font-mono">{formData.level2Qual.certificateNumber || "N/A"}</dd>
                            </div>
                          </dl>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employment Tab */}
          <TabsContent value="employment" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Employment History</h2>
                
                {formData.employmentHistory && formData.employmentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {formData.employmentHistory.map((job: any, idx: number) => (
                      <Card key={idx} className="bg-muted/30">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{job.role} at {job.employer}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {job.startDate} → {job.endDate}
                          </p>
                          <p className="text-sm"><span className="font-medium">Reason for leaving:</span> {job.reasonForLeaving}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No employment history provided</p>
                )}

                {(formData as any).employmentGaps && (
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 mt-4">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">Employment Gaps Explanation</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{(formData as any).employmentGaps}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">References</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Reference 1 */}
                  <Card className="bg-muted/30">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Reference 1</h3>
                      <dl className="space-y-3 text-sm">
                        <div>
                          <dt className="text-muted-foreground mb-1">Full Name</dt>
                          <dd className="font-medium">{(formData as any).reference1Name || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Relationship</dt>
                          <dd>{(formData as any).reference1Relationship || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Contact</dt>
                          <dd>{(formData as any).reference1Contact || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Childcare Reference</dt>
                          <dd>
                            <Badge variant={(formData as any).reference1Childcare === "Yes" ? "default" : "secondary"}>
                              {(formData as any).reference1Childcare || "N/A"}
                            </Badge>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  {/* Reference 2 */}
                  <Card className="bg-muted/30">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Reference 2</h3>
                      <dl className="space-y-3 text-sm">
                        <div>
                          <dt className="text-muted-foreground mb-1">Full Name</dt>
                          <dd className="font-medium">{(formData as any).reference2Name || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Relationship</dt>
                          <dd>{(formData as any).reference2Relationship || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Contact</dt>
                          <dd>{(formData as any).reference2Contact || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-1">Childcare Reference</dt>
                          <dd>
                            <Badge variant={(formData as any).reference2Childcare === "Yes" ? "default" : "secondary"}>
                              {(formData as any).reference2Childcare || "N/A"}
                            </Badge>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Household Tab */}
          <TabsContent value="household" className="space-y-6">
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Household Members
                </h2>
                
                {formData.adults && formData.adults.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Adults in Household</h3>
                    <div className="grid gap-4">
                      {formData.adults.map((person: any, idx: number) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="p-4">
                            <p className="font-medium text-lg">{person.fullName}</p>
                            <div className="grid md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                              <p>Relationship: {person.relationship}</p>
                              <p>DOB: {person.dob}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {formData.children && formData.children.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Children in Household</h3>
                    <div className="grid gap-4">
                      {formData.children.map((child: any, idx: number) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="p-4">
                            <p className="font-medium text-lg">{child.fullName}</p>
                            <p className="text-sm text-muted-foreground mt-1">DOB: {child.dob}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {(!formData.assistants || formData.assistants.length === 0) && 
                 (!formData.adults || formData.adults.length === 0) && 
                 (!formData.children || formData.children.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No household members recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            {/* Applicant DBS */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 flex items-center gap-3">
                      <Shield className="h-6 w-6 text-blue-600" />
                      Applicant DBS Check
                    </h2>
                    <p className="text-muted-foreground">
                      Request DBS check directly for the main applicant
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsApplicantDBSModalOpen(true)}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Request DBS
                  </Button>
                </div>
                
                <Card className="bg-white/50 dark:bg-gray-900/50">
                  <CardContent className="p-6">
                    <dl className="grid md:grid-cols-3 gap-6">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">Applicant Name</dt>
                        <dd className="text-lg font-semibold">{`${dbApplication?.first_name || ""} ${dbApplication?.last_name || ""}`.trim()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">Email</dt>
                        <dd className="text-lg">{dbApplication?.email || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">Has DBS</dt>
                        <dd>
                          <Badge variant={dbApplication?.has_dbs === "Yes" ? "default" : "secondary"} className="text-sm">
                            {dbApplication?.has_dbs || "N/A"}
                          </Badge>
                        </dd>
                      </div>
                      {dbApplication?.has_dbs === "Yes" && dbApplication?.dbs_number && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground mb-1">DBS Number</dt>
                          <dd className="text-lg font-mono">{dbApplication.dbs_number}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Household Members Compliance */}
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Household Members Compliance
                </h2>
                <DBSComplianceSection
                  applicationId={id!}
                  applicantEmail={dbApplication?.email || ""}
                  applicantName={`${dbApplication?.first_name || ""} ${dbApplication?.last_name || ""}`.trim()}
                />
              </CardContent>
            </Card>

            {/* Assistants Compliance */}
            <Card className="border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Assistants & Co-childminders Compliance
                </h2>
                <AssistantComplianceSection
                  applicationId={id!}
                  applicantEmail={dbApplication?.email || ""}
                  applicantName={`${dbApplication?.first_name || ""} ${dbApplication?.last_name || ""}`.trim()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <RequestApplicantDBSModal
          open={isApplicantDBSModalOpen}
          onOpenChange={setIsApplicantDBSModalOpen}
          applicationId={id!}
          applicantName={`${dbApplication?.first_name || ""} ${dbApplication?.last_name || ""}`.trim()}
          applicantEmail={dbApplication?.email || ""}
          onSuccess={fetchApplication}
        />
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetail;
