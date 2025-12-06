import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #1B9AAA",
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B9AAA",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottom: "1px solid #ddd",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    width: "60%",
    color: "#333",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  notKnown: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  currentProvider: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  formerProvider: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },
  infoBox: {
    backgroundColor: "#e7f5f7",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    borderLeft: "3px solid #1B9AAA",
  },
  textBlock: {
    marginBottom: 8,
    lineHeight: 1.4,
  },
});

interface ResponseData {
  recordsStatus: string[];
  checkCompletedDate: string;
  sectionC?: {
    uniqueRefNumber: string;
    otherNames: string;
    addressKnown: string;
    dateOfRegistration: string;
    registeredBodyName: string;
    registrationStatus: string;
    lastInspection: string;
    provisionType: string;
    registers: string;
    telephone: string;
    emailAddress: string;
    provisionAddress: string;
    childrenInfo: string;
    conditions: string;
    suitabilityInfo: string;
    inspectionInfo: string;
    safeguardingConcerns: string;
  } | null;
  sectionD?: {
    otherNamesD: string;
    capacityKnown: string;
    relevantInfo: string;
  } | null;
}

interface OfstedResponsePDFProps {
  referenceId: string;
  applicantName: string;
  dateOfBirth: string;
  ofstedEmail: string;
  sentAt: string;
  completedAt: string;
  responseData: ResponseData;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "notKnown":
      return "Not known to Ofsted";
    case "currentProvider":
      return "Currently known as registered provider";
    case "formerOrOther":
      return "Known as former/other capacity";
    default:
      return status;
  }
};

export const OfstedResponsePDF = ({
  referenceId,
  applicantName,
  dateOfBirth,
  ofstedEmail,
  sentAt,
  completedAt,
  responseData,
}: OfstedResponsePDFProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy");
    } catch {
      return dateStr || "N/A";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Known to Ofsted Response</Text>
          <Text style={styles.subtitle}>
            Reference: {referenceId} | Generated: {format(new Date(), "dd MMMM yyyy")}
          </Text>
        </View>

        {/* Applicant Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applicant Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Applicant Name:</Text>
            <Text style={styles.value}>{applicantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{formatDate(dateOfBirth)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ofsted Email:</Text>
            <Text style={styles.value}>{ofstedEmail}</Text>
          </View>
        </View>

        {/* Request Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Timeline</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Request Sent:</Text>
            <Text style={styles.value}>{formatDate(sentAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Response Received:</Text>
            <Text style={styles.value}>{formatDate(completedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check Completed Date:</Text>
            <Text style={styles.value}>{formatDate(responseData.checkCompletedDate)}</Text>
          </View>
        </View>

        {/* Ofsted Findings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ofsted Findings</Text>
          <View style={styles.infoBox}>
            {responseData.recordsStatus.map((status, idx) => (
              <Text key={idx} style={styles.textBlock}>
                • {getStatusLabel(status)}
              </Text>
            ))}
          </View>
        </View>

        {/* Section C - Current Provider Details */}
        {responseData.sectionC && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Section C - Current Registered Provider Details</Text>
            {responseData.sectionC.uniqueRefNumber && (
              <View style={styles.row}>
                <Text style={styles.label}>Unique Reference Number:</Text>
                <Text style={styles.value}>{responseData.sectionC.uniqueRefNumber}</Text>
              </View>
            )}
            {responseData.sectionC.registrationStatus && (
              <View style={styles.row}>
                <Text style={styles.label}>Registration Status:</Text>
                <Text style={styles.value}>{responseData.sectionC.registrationStatus}</Text>
              </View>
            )}
            {responseData.sectionC.provisionType && (
              <View style={styles.row}>
                <Text style={styles.label}>Provision Type:</Text>
                <Text style={styles.value}>{responseData.sectionC.provisionType}</Text>
              </View>
            )}
            {responseData.sectionC.dateOfRegistration && (
              <View style={styles.row}>
                <Text style={styles.label}>Date of Registration:</Text>
                <Text style={styles.value}>{formatDate(responseData.sectionC.dateOfRegistration)}</Text>
              </View>
            )}
            {responseData.sectionC.lastInspection && (
              <View style={styles.row}>
                <Text style={styles.label}>Last Inspection:</Text>
                <Text style={styles.value}>{responseData.sectionC.lastInspection}</Text>
              </View>
            )}
            {responseData.sectionC.conditions && (
              <View style={styles.row}>
                <Text style={styles.label}>Conditions:</Text>
                <Text style={styles.value}>{responseData.sectionC.conditions}</Text>
              </View>
            )}
            {responseData.sectionC.suitabilityInfo && (
              <View style={styles.row}>
                <Text style={styles.label}>Suitability Information:</Text>
                <Text style={styles.value}>{responseData.sectionC.suitabilityInfo}</Text>
              </View>
            )}
            {responseData.sectionC.safeguardingConcerns && (
              <View style={styles.row}>
                <Text style={styles.label}>Safeguarding Concerns:</Text>
                <Text style={styles.value}>{responseData.sectionC.safeguardingConcerns}</Text>
              </View>
            )}
          </View>
        )}

        {/* Section D - Former/Other Provider Details */}
        {responseData.sectionD && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Section D - Former/Other Capacity Details</Text>
            {responseData.sectionD.capacityKnown && (
              <View style={styles.row}>
                <Text style={styles.label}>Capacity Known:</Text>
                <Text style={styles.value}>{responseData.sectionD.capacityKnown}</Text>
              </View>
            )}
            {responseData.sectionD.otherNamesD && (
              <View style={styles.row}>
                <Text style={styles.label}>Other Names:</Text>
                <Text style={styles.value}>{responseData.sectionD.otherNamesD}</Text>
              </View>
            )}
            {responseData.sectionD.relevantInfo && (
              <View style={styles.row}>
                <Text style={styles.label}>Relevant Information:</Text>
                <Text style={styles.value}>{responseData.sectionD.relevantInfo}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This document was generated by ReadyKids Childminder Agency • Confidential
        </Text>
      </Page>
    </Document>
  );
};
