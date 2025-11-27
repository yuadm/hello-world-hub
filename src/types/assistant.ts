export interface AssistantFormData {
  // Section 1: Personal Details
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
  
  // Section 2: Address History
  homeAddressLine1: string;
  homeAddressLine2: string;
  homeTown: string;
  homePostcode: string;
  homeMoveIn: string;
  addressHistory: Array<{ address: string; moveIn: string; moveOut: string }>;
  livedOutsideUK: string;
  
  // Section 3: Professional History & Training
  employmentHistory: Array<{ 
    employer: string; 
    title: string; 
    startDate: string; 
    endDate: string 
  }>;
  employmentGaps: string;
  pfaCompleted: string;
  safeguardingCompleted: string;
  
  // Section 4: Vetting & Suitability
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
  
  // Section 5: Health Declaration
  healthCondition: string;
  healthConditionDetails: string;
  smoker: string;
  
  // Section 6: Declaration
  consentChecks: boolean;
  declarationTruth: boolean;
  declarationNotify: boolean;
  signatureFullName: string;
  signatureDate: string;
}
