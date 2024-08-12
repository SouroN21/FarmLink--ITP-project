// PDFReport.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const PDFReport = ({ orders }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>All Orders</Text>
        {/* Render orders table */}
        <table>
          {/* Table headers */}
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Products</th>
              <th>Quantity</th>
              <th>Product Price</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user}</td>
                <td>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>{item.productName}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>{item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>${item.productPrice.toFixed(2)}</li>
                    ))}
                  </ul>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </View>
    </Page>
  </Document>
);

export default PDFReport;