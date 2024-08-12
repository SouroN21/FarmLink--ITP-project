import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppointmentPDF from './AppointmentPDF';
import './AppointmentListPage.scss';
import GlobalStyles from '../../GlobalStyles';

function AppointmentListPage() {
  const [appointments, setAppointments] = useState([]);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    date: "",
    time: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = () => {
    axios.get("http://localhost:5000/appointments/")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        alert("Error fetching appointments. Please try again later.");
      });
  };

  const handleUpdateClick = (appointment) => {
    setUpdatedAppointment(appointment);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = (id) => {
    const { firstName, lastName, email, message, date, time } = updatedAppointment;
    const updatedFields = { firstName, lastName, email, message, date, time };

    axios.put(`http://localhost:5000/appointments/update/${id}`, updatedFields)
      .then((res) => {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment._id === id ? { ...appointment, ...updatedFields } : appointment
          )
        );
        alert("Appointment updated successfully");
        setShowUpdateForm(false);
      })
      .catch((err) => {
        console.error("Error updating appointment:", err);
        alert("Error occurred while updating appointment. Please try again later.");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/appointments/delete/${id}`)
      .then((res) => {
        setAppointments(appointments.filter(appointment => appointment._id !== id));
        alert("Appointment deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting appointment:", err);
        alert("Error occurred while deleting appointment. Please try again later.");
      });
  };

  // Function to check if appointment is upcoming or overdue
  const getAppointmentStatus = (date) => {
    const currentDate = new Date();
    const appointmentDate = new Date(date);
    if (appointmentDate > currentDate) {
      return 'Upcoming';
    } else {
      return 'Overdue';
    }
  };


  return (
    <div className="appointment-list-page">
      <GlobalStyles/>
      <h2>Appointment List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Time</th>
            <th>Appointment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.firstName} {appointment.lastName}</td>
              <td>{appointment.email}</td>
              <td>{appointment.message}</td>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
              <td>{getAppointmentStatus(appointment.date)}</td>
              <td>
                {appointment.status !== 'Accepted' ? (
                  <>
                    <button onClick={() => handleUpdateClick(appointment)}>Update</button>
                    <button onClick={() => handleDelete(appointment._id)}>Delete</button>
                  </>
                ) : (
                  <span>Accepted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUpdateForm && (
        <div className='update-form-container'>
          <h2>Update Appointment</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="inputFirstName" className="form-label">First Name</label>
              <input type="text" value={updatedAppointment.firstName} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, firstName: e.target.value })} />
            </div>
            <div className="mb-3">
              <label htmlFor="inputLastName" className="form-label">Last Name</label>
              <input type="text" value={updatedAppointment.lastName} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, lastName: e.target.value })} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
              <input type="text" value={updatedAppointment.email} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, email: e.target.value })} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputmessage" className="form-label">Message</label>
              <textarea value={updatedAppointment.message} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, message: e.target.value })} />
            </div>
            <div className="mb-3">
              <label htmlFor="inputDate" className="form-label">Date</label>
              <input type="date" value={updatedAppointment.date} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, date: e.target.value })} />
            </div>
            <div className="mb-3">
              <label htmlFor="inputTime" className="form-label">Time</label>
              <input type="text" value={updatedAppointment.time} onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, time: e.target.value })} />
            </div>
            <button onClick={() => handleUpdateSubmit(updatedAppointment._id)}>Submit Update</button>
          </form>
        </div>
      )}
      <div className='pdf-download-button'>
        <PDFDownloadLink document={<AppointmentPDF appointments={appointments} />} fileName="appointments.pdf">
          {({ blob, url, loading, error }) => (
            <button>{loading ? "Loading document..." : "Download PDF"}</button>
          )}
        </PDFDownloadLink>
      </div>

    </div>
  );
};

export default AppointmentListPage;
