import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #0066cc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0066cc",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: "#666",
  },
  section: {
    marginBottom: 20,
    borderLeft: "3pt solid #0066cc",
    paddingLeft: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: "#1a1a1a",
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "35%",
    fontWeight: 600,
    color: "#333",
  },
  value: {
    width: "65%",
    color: "#1a1a1a",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 6,
    color: "#0066cc",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkboxBox: {
    width: 12,
    height: 12,
    border: "1pt solid #333",
    marginRight: 6,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#0066cc",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1pt solid #ccc",
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
});

interface FormData {
  // Section 1
  title?: string;
  first_name?: string;
  middle_names?: string;
  last_name?: string;
  previous_names?: any;
  date_of_birth?: string;
  birth_town?: string;
  sex?: string;
  ni_number?: string;
  
  // Section 2
  current_address?: any;
  address_history?: any;
  lived_outside_uk?: string;
  outside_uk_details?: string;
  
  // Section 3
  previous_registration?: string;
  previous_registration_details?: any;
  has_dbs?: string;
  dbs_number?: string;
  dbs_update_service?: string;
  criminal_history?: string;
  criminal_history_details?: string;
  disqualified?: string;
  social_services?: string;
  social_services_details?: string;
  
  // Section 4
  health_conditions?: string;
  health_conditions_details?: string;
  smoker?: string;
  
  // Section 5
  consent_checks?: boolean;
  declaration_truth?: boolean;
  declaration_notify?: boolean;
  signature_name?: string;
  signature_date?: string;
  
  submitted_at?: string;
}

interface HouseholdFormPDFProps {
  formData: FormData;
  memberName: string;
  applicantName: string;
}

export function HouseholdFormPDF({ formData, memberName, applicantName }: HouseholdFormPDFProps) {
  const formatDate = (date?: string) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CMA-H2 Suitability Check Form</Text>
          <Text style={styles.subtitle}>Household Member of: {applicantName}</Text>
          <Text style={styles.subtitle}>Submitted: {formatDate(formData.submitted_at)}</Text>
        </View>

        {/* Section 1: Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Personal Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>
              {formData.title} {formData.first_name} {formData.middle_names} {formData.last_name}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{formatDate(formData.date_of_birth)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Place of Birth:</Text>
            <Text style={styles.value}>{formData.birth_town || "Not provided"}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Sex:</Text>
            <Text style={styles.value}>{formData.sex || "Not provided"}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>NI Number:</Text>
            <Text style={styles.value}>{formData.ni_number || "Not provided"}</Text>
          </View>

          {formData.previous_names && Array.isArray(formData.previous_names) && formData.previous_names.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 600, marginBottom: 6 }}>Previous Names:</Text>
              {formData.previous_names.map((name: any, idx: number) => (
                <View key={idx} style={styles.card}>
                  <Text>{name.fullName}</Text>
                  <Text style={{ fontSize: 8, color: "#666" }}>
                    {formatDate(name.dateFrom)} to {formatDate(name.dateTo)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 2: Address History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Address History</Text>
          
          {formData.current_address && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Address</Text>
              <Text>{formData.current_address.line1}</Text>
              {formData.current_address.line2 && <Text>{formData.current_address.line2}</Text>}
              <Text>{formData.current_address.town}</Text>
              <Text>{formData.current_address.postcode}</Text>
              <Text style={{ fontSize: 8, color: "#666", marginTop: 4 }}>
                Moved in: {formatDate(formData.current_address.moveIn)}
              </Text>
            </View>
          )}

          {formData.address_history && Array.isArray(formData.address_history) && formData.address_history.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 600, marginBottom: 6 }}>Previous Addresses:</Text>
              {formData.address_history.map((addr: any, idx: number) => (
                <View key={idx} style={styles.card}>
                  <Text>{addr.address}</Text>
                  <Text style={{ fontSize: 8, color: "#666" }}>
                    {formatDate(addr.moveIn)} to {formatDate(addr.moveOut)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Lived Outside UK:</Text>
            <Text style={styles.value}>{formData.lived_outside_uk || "No"}</Text>
          </View>
          {formData.outside_uk_details && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Details:</Text>
              <Text style={styles.value}>{formData.outside_uk_details}</Text>
            </View>
          )}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Section 3: Vetting Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Vetting Information</Text>
          
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Previous Registration:</Text>
            <Text style={styles.value}>{formData.previous_registration || "No"}</Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 600, marginBottom: 6 }}>DBS Certificate</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Has DBS:</Text>
              <Text style={styles.value}>{formData.has_dbs || "No"}</Text>
            </View>
            {formData.dbs_number && (
              <>
                <View style={styles.fieldRow}>
                  <Text style={styles.label}>DBS Number:</Text>
                  <Text style={styles.value}>{formData.dbs_number}</Text>
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.label}>Update Service:</Text>
                  <Text style={styles.value}>{formData.dbs_update_service || "Not subscribed"}</Text>
                </View>
              </>
            )}
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 600, marginBottom: 6 }}>Suitability Checks</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Criminal History:</Text>
              <Text style={styles.value}>{formData.criminal_history || "No"}</Text>
            </View>
            {formData.criminal_history_details && (
              <View style={styles.card}>
                <Text>{formData.criminal_history_details}</Text>
              </View>
            )}

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Disqualified:</Text>
              <Text style={styles.value}>{formData.disqualified || "No"}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Social Services:</Text>
              <Text style={styles.value}>{formData.social_services || "No"}</Text>
            </View>
            {formData.social_services_details && (
              <View style={styles.card}>
                <Text>{formData.social_services_details}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 4: Health & Lifestyle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Health & Lifestyle</Text>
          
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Health Conditions:</Text>
            <Text style={styles.value}>{formData.health_conditions || "No"}</Text>
          </View>
          {formData.health_conditions_details && (
            <View style={styles.card}>
              <Text>{formData.health_conditions_details}</Text>
            </View>
          )}

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Smoker:</Text>
            <Text style={styles.value}>{formData.smoker || "Not specified"}</Text>
          </View>
        </View>

        {/* Section 5: Declaration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Declaration</Text>
          
          <View style={styles.checkbox}>
            <View style={[styles.checkboxBox, formData.consent_checks && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>
              I consent to Ready Kids carrying out all necessary checks
            </Text>
          </View>

          <View style={styles.checkbox}>
            <View style={[styles.checkboxBox, formData.declaration_truth && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>
              I declare that the information provided is true, accurate, and complete
            </Text>
          </View>

          <View style={styles.checkbox}>
            <View style={[styles.checkboxBox, formData.declaration_notify && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>
              I understand I must notify the childminder of any changes to this information
            </Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Signature:</Text>
              <Text style={styles.value}>{formData.signature_name || "Not provided"}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{formatDate(formData.signature_date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>CMA-H2 Suitability Check Form - Household Member: {memberName}</Text>
          <Text>Generated: {new Date().toLocaleDateString("en-GB")} at {new Date().toLocaleTimeString("en-GB")}</Text>
        </View>
      </Page>
    </Document>
  );
}
