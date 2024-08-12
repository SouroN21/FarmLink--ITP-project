import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './expertAppointmentPage.scss';

const ExpertAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      if (response.status === 200) {
        setAppointments(response.data);
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/appointments/accept/${id}`);
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/delete/${id}`);
      setAppointments(appointments.filter(appointment => appointment._id !== id));
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
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
    <div className="expert-appointments-page">
      <h2>Appointments</h2>
      {emailSent && (
        <div className="alert alert-success" role="alert">
          Email sent successfully!
        </div>
      )}
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
                    <button onClick={() => handleAccept(appointment._id)}>Accept</button>
                    <button onClick={() => handleReject(appointment._id)}>Reject</button>
                  </>
                ) : (
                  <span>Accepted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpertAppointmentsPage;
