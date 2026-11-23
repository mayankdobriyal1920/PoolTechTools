// src/lib/pdf/ReportPDF.tsx
// Customer-facing PDF — PublicReportView excludes privateNotes (type-level guarantee).

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { Report } from "@/lib/db/types";

// PublicReportView = Report without privateNotes (enforced at call site)
export type PublicReportView = Omit<Report, "privateNotes">;

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#0f2a44" },
  header: { marginBottom: 16, borderBottom: "2px solid #2b7bbd", paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: "bold", color: "#2b7bbd" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 2 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#2b7bbd", marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 2 },
  label: { width: 110, fontWeight: "bold", color: "#444" },
  value: { flex: 1 },
  chip: { backgroundColor: "#eaf6fb", borderRadius: 4, padding: "2 6", marginRight: 4, marginBottom: 4, fontSize: 9 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  table: { marginTop: 4 },
  tableRow: { flexDirection: "row", borderBottom: "1px solid #eee", paddingVertical: 3 },
  cell: { flex: 1, fontSize: 9 },
  footer: { position: "absolute", bottom: 20, left: 32, right: 32, textAlign: "center", fontSize: 8, color: "#999" },
  photo: { width: 180, height: 135, marginRight: 8, marginTop: 6, borderRadius: 4 },
  photosRow: { flexDirection: "row", marginTop: 6 },
});

interface ReportPDFProps {
  report: PublicReportView;
  businessName?: string;
  logoDataUrl?: string;
  photoDataUrls?: string[];
}

export function ReportPDF({ report, businessName, logoDataUrl, photoDataUrls = [] }: ReportPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {logoDataUrl && <Image src={logoDataUrl} style={{ width: 32, height: 32, marginRight: 8 }} />}
            <View>
              <Text style={styles.title}>{businessName || "PoolTechTools Service Report"}</Text>
              <Text style={styles.subtitle}>Service Report · {report.reportNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Details</Text>
          <View style={styles.row}><Text style={styles.label}>Customer:</Text><Text style={styles.value}>{report.customerNameSnapshot}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Visit date:</Text><Text style={styles.value}>{new Date(report.visitDate).toLocaleString()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Technician:</Text><Text style={styles.value}>{report.technician}</Text></View>
          {report.readings && Object.keys(report.readings).length > 0 && (
            <View style={styles.row}><Text style={styles.label}>Water temp:</Text><Text style={styles.value}>{report.readings?.temperature ?? "—"}</Text></View>
          )}
        </View>

        {report.tasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks Completed</Text>
            <View style={styles.chipRow}>
              {report.tasks.map((t, i) => <Text key={i} style={styles.chip}>{t}</Text>)}
            </View>
          </View>
        )}

        {Object.keys(report.readings).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Water Readings</Text>
            <View style={styles.table}>
              {Object.entries(report.readings).map(([k, v]) => (
                <View key={k} style={styles.tableRow}>
                  <Text style={styles.cell}>{k}</Text>
                  <Text style={styles.cell}>{Number.isFinite(v) ? v.toFixed(2) : "—"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {report.chemicals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chemicals Added</Text>
            <View style={styles.table}>
              {report.chemicals.map((c, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.cell}>{c.product}</Text>
                  <Text style={styles.cell}>{c.amount} {c.unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {report.customerSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{report.customerSummary}</Text>
          </View>
        )}

        {photoDataUrls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photosRow}>
              {photoDataUrls.map((u, i) => <Image key={i} src={u} style={styles.photo} />)}
            </View>
          </View>
        )}

        <Text style={styles.footer}>Generated by PoolTechTools · {new Date(report.createdAt).toLocaleDateString()} · Page 1</Text>
      </Page>
    </Document>
  );
}
