import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    width: "100%",
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
});

const AppointmentPDF = ({ appointments }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>All Appointments</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Full Name</Text>
            <Text style={styles.tableCell}>Email</Text>
            <Text style={styles.tableCell}>Message</Text>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Time</Text>
          </View>
          {appointments.map((appointment, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{appointment.firstName}{appointment.lastName}</Text>
              <Text style={styles.tableCell}>{appointment.email}</Text>
              <Text style={styles.tableCell}>{appointment.message}</Text>
              <Text style={styles.tableCell}>{appointment.date}</Text>
              <Text style={styles.tableCell}>{appointment.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default AppointmentPDF;