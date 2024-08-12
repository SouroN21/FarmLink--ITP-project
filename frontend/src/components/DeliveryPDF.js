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

const DeliveryPDF = ({ deliveries }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>All Deliveries</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Full Name</Text>
            <Text style={styles.tableCell}>Address</Text>
            <Text style={styles.tableCell}>City</Text>
            <Text style={styles.tableCell}>Postal Code</Text>
            <Text style={styles.tableCell}>Phone</Text>
          </View>
          {deliveries.map((delivery, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{delivery.fname}</Text>
              <Text style={styles.tableCell}>{delivery.address}</Text>
              <Text style={styles.tableCell}>{delivery.city}</Text>
              <Text style={styles.tableCell}>{delivery.postalCode}</Text>
              <Text style={styles.tableCell}>{delivery.phone}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default DeliveryPDF;
