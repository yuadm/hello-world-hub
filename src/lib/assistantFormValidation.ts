import { AssistantFormData } from "@/types/assistant";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAssistantSection1(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title) errors.title = "Select a title";
  if (!data.firstName?.trim()) errors.firstName = "Enter your first name";
  if (!data.lastName?.trim()) errors.lastName = "Enter your last name";
  if (!data.dob) errors.dob = "Enter your date of birth";
  if (!data.birthTown?.trim()) errors.birthTown = "Enter your town of birth";
  if (!data.sex) errors.sex = "Select your sex";
  if (!data.niNumber?.trim()) errors.niNumber = "Enter your National Insurance number";
  else if (!/^[A-Z]{2}[0-9]{6}[A-D]$/.test(data.niNumber.replace(/\s/g, ""))) {
    errors.niNumber = "Enter a valid NI number format (e.g., QQ123456C)";
  }

  if (data.otherNames === "Yes") {
    if (!data.previousNames || data.previousNames.length === 0) {
      errors.previousNames = "Add at least one previous name";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAssistantSection2(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.homeAddressLine1?.trim()) errors.homeAddressLine1 = "Enter address line 1";
  if (!data.homeTown?.trim()) errors.homeTown = "Enter town or city";
  if (!data.homePostcode?.trim()) errors.homePostcode = "Enter postcode";
  if (!data.homeMoveIn) errors.homeMoveIn = "Enter move in date";
  if (!data.livedOutsideUK) errors.livedOutsideUK = "Select yes or no";

  // Calculate 5-year coverage
  if (data.homeMoveIn) {
    const moveInDate = new Date(data.homeMoveIn);
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    if (moveInDate > fiveYearsAgo) {
      // Need address history
      let coverageDate = moveInDate;
      if (data.addressHistory && data.addressHistory.length > 0) {
        const sortedHistory = [...data.addressHistory].sort((a, b) => 
          new Date(b.moveOut).getTime() - new Date(a.moveOut).getTime()
        );
        coverageDate = new Date(sortedHistory[sortedHistory.length - 1].moveIn);
      }

      if (coverageDate > fiveYearsAgo) {
        errors.addressHistory = "Your address history must cover the last 5 years";
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAssistantSection3(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.employmentHistory || data.employmentHistory.length === 0) {
    errors.employmentHistory = "Add at least one employment or education entry";
  } else {
    data.employmentHistory.forEach((emp, index) => {
      if (!emp.employer?.trim()) errors[`employment_${index}_employer`] = "Enter employer/education provider";
      if (!emp.title?.trim()) errors[`employment_${index}_title`] = "Enter job title/course";
      if (!emp.startDate) errors[`employment_${index}_startDate`] = "Enter start date";
    });
  }

  if (!data.pfaCompleted) errors.pfaCompleted = "Select yes or no for Paediatric First Aid";
  if (!data.safeguardingCompleted) errors.safeguardingCompleted = "Select yes or no for Safeguarding training";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAssistantSection4(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.prevReg) errors.prevReg = "Select yes or no for previous registration";
  if (!data.hasDBS) errors.hasDBS = "Select yes or no for DBS certificate";
  
  if (data.hasDBS === "Yes") {
    if (!data.dbsNumber?.trim()) {
      errors.dbsNumber = "Enter your DBS certificate number";
    } else if (!/^\d{12}$/.test(data.dbsNumber.replace(/\s/g, ""))) {
      errors.dbsNumber = "DBS certificate number must be 12 digits";
    }
    if (!data.dbsUpdate) errors.dbsUpdate = "Select yes or no for DBS Update Service";
  }

  if (!data.offenceHistory) errors.offenceHistory = "Select yes or no for criminal history";
  if (!data.disqualified) errors.disqualified = "Select yes or no for disqualification";
  if (!data.socialServices) errors.socialServices = "Select yes or no for social services involvement";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAssistantSection5(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.healthCondition) errors.healthCondition = "Select yes or no for health conditions";
  if (!data.smoker) errors.smoker = "Select yes or no for smoking status";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateAssistantSection6(data: Partial<AssistantFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.consentChecks) errors.consentChecks = "You must consent to checks";
  if (!data.declarationTruth) errors.declarationTruth = "You must confirm the information is true";
  if (!data.declarationNotify) errors.declarationNotify = "You must agree to notify of changes";
  if (!data.signatureFullName?.trim()) errors.signatureFullName = "Enter your full name";

  return { isValid: Object.keys(errors).length === 0, errors };
}
