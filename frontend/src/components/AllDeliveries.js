import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DeliveryPDF from "./DeliveryPDF";

export default function AllDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  
  const [updatedDelivery, setUpdatedDelivery] = useState({
    fname: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false); // New state to control form visibility

  useEffect(() => {
    function getDeliveryInfo() {
      axios.get("http://localhost:5000/delivery/").then((res) => {
        setDeliveries(res.data);
      }).catch((err) => {
        alert(err.message);
      });
    }
    getDeliveryInfo();
  }, []);

  const handleUpdateClick = (delivery) => {
    setUpdatedDelivery(delivery);
    setShowUpdateForm(true); // Show the update form when the button is clicked
  };

  const handleUpdateSubmit = (id) => {
    axios
      .put(`http://localhost:5000/delivery/update/${id}`, updatedDelivery)
      .then((res) => {
        const updatedDeliveries = deliveries.map((delivery) =>
          delivery._id === id ? updatedDelivery : delivery
        );
        setDeliveries(updatedDeliveries);
        alert("Delivery updated successfully");
        setShowUpdateForm(false); // Hide the update form after successful update
      })
      .catch((err) => {
        alert("Error occurred while updating delivery");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/delivery/delete/${id}`)
      .then((res) => {
        setDeliveries(deliveries.filter(delivery => delivery._id !== id));
        alert("Delivery deleted successfully");
      })
      .catch((err) => {
        alert("Error occurred while deleting delivery");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>All Deliveries</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Full Name</th>
            <th style={tableHeaderStyle}>Address</th>
            <th style={tableHeaderStyle}>City</th>
            <th style={tableHeaderStyle}>Postal Code</th>
            <th style={tableHeaderStyle}>Phone</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, index) => (
            <tr key={index}>
              <td>{delivery.fname}</td>
              <td>{delivery.address}</td>
              <td>{delivery.city}</td>
              <td>{delivery.postalCode}</td>
              <td>{delivery.phone}</td>
              <td>
                <button onClick={() => handleUpdateClick(delivery)}>Update</button>
                <button onClick={() => handleDelete(delivery._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateForm && (
        <div>
          <h2>Update Delivery</h2>
          {/* Render your update form here */}
          {/* Example form elements: */}
          <input type="text" value={updatedDelivery.fname} onChange={(e) => setUpdatedDelivery({ ...updatedDelivery, fname: e.target.value })} />
          <input type="text" value={updatedDelivery.address} onChange={(e) => setUpdatedDelivery({ ...updatedDelivery, address: e.target.value })} />
          <input type="text" value={updatedDelivery.city} onChange={(e) => setUpdatedDelivery({ ...updatedDelivery, city: e.target.value })} />
          <input type="text" value={updatedDelivery.postalCode} onChange={(e) => setUpdatedDelivery({ ...updatedDelivery, postalCode: e.target.value })} />
          <input type="text" value={updatedDelivery.phone} onChange={(e) => setUpdatedDelivery({ ...updatedDelivery, phone: e.target.value })} />
          <button onClick={() => handleUpdateSubmit(updatedDelivery._id)}>Submit Update</button>
        </div>
      )}

      <PDFDownloadLink document={<DeliveryPDF deliveries={deliveries} />} fileName="deliveries.pdf">
        {({ blob, url, loading, error }) => (
          <button style={pdfButtonStyle}>{loading ? "Loading document..." : "Download PDF"}</button>
        )}
      </PDFDownloadLink>
    </div>
  );
}

const tableHeaderStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  textAlign: "left",
  padding: "8px",
};

const pdfButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};


