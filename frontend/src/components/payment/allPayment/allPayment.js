import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './allPayment.css'; // Import the CSS file

const AllPayment = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();

  const getPayments = () => {
    axios.get("http://localhost:5000/api/payment/")
      .then((res) => {
        setPayments(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getPayments();
  }, []);

  const handleDelete = (id) => {
    setSelectedPayment(id);
    setConfirmModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/api/payment/delete/${selectedPayment}`)
      .then((res) => {
        toast.success(res.data.status);
        getPayments();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data.error || "Error deleting payment.");
      })
      .finally(() => {
        setConfirmModal(false);
      });
  };

  const handleUpdate = (paymentId) => {
    navigate(`/updatePayment/${paymentId}`);
  };

  const handleShowDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Report</Text>
          <Text>------------------------------------</Text>
        </View>
        <View style={styles.body}>
          {payments.map((payment) => (
            <View key={payment._id} style={styles.payment}>
              <Text>Name on Card: {payment.holdername}</Text>
              <Text>Email: {payment.email}</Text>
              <Text>Card Number: {payment.cardNumber}</Text>
              <Text>Expiry: {payment.expiry}</Text>
              <Text>CVV: {payment.cvv}</Text>
              <Text>Address: {payment.address}</Text>
              <Text>City: {payment.city}</Text>
              <Text>State: {payment.state}</Text>
              <Text>Zipcode: {payment.zipcode}</Text>
              <Text>------------------------------------</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <Container>
      <h1 className="mt-4 mb-4">Payment List</h1>
      <Button variant="info" className="mb-4" style={{ marginRight: '10px' }}>
        <PDFDownloadLink document={MyDocument} fileName="payments_report.pdf">
          {({ blob, url, loading, error }) => (
            <span style={{ textDecoration: 'none' }}>{loading ? 'Loading document...' : 'Create Report'}</span>
          )}
        </PDFDownloadLink>
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.holdername}</td>
              <td>{payment.email}</td>
              <td>
                <Button variant="info" onClick={() => handleShowDetails(payment)}>Show Details</Button>
                <Button variant="danger" onClick={() => handleDelete(payment._id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleUpdate(payment._id)} className="ml-2">Update</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <p>Name on Card: {selectedPayment.holdername}</p>
              <p>Email: {selectedPayment.email}</p>
              <p>Card Number: {selectedPayment.cardNumber}</p>
              <p>Expiry: {selectedPayment.expiry}</p>
              <p>CVV: {selectedPayment.cvv}</p>
              <p>Address: {selectedPayment.address}</p>
              <p>City: {selectedPayment.city}</p>
              <p>State: {selectedPayment.state}</p>
              <p>Zipcode: {selectedPayment.zipcode}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={confirmModal} onHide={() => setConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this payment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    marginBottom: 20,
  },
  payment: {
    marginBottom: 10,
  },
});

export default AllPayment;
