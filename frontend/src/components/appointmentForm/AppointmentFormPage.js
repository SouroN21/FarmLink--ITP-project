import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import './AppointmentFormPage.scss'; // Import SCSS file for styling
import GlobalStyles from '../../GlobalStyles';

const AppointmentFormPage = () => {
  const location = useLocation(); // Get the current location
  const [expertId, setExpertId] = useState(""); // Initialize expertId state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Extract expertId from the query parameters when the component mounts or when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('expertId');
    if (id) {
      setExpertId(id);
    }
  }, [location]);

  // Function to handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    const newAppointment = {
      expertId,
      firstName,
      lastName,
      email,
      message,
      date,
      time,
    };

    axios.post("http://localhost:5000/appointments/add", newAppointment)
      .then(() => {
        // If the appointment is saved successfully, send an email to the expert
        axios.post("http://localhost:5000/appointments/send-email", {
          expertId,
          subject: "New Appointment Request",
          body: `You have a new appointment request from ${firstName} ${lastName}. 
            Date: ${date}, Time: ${time}, Email: ${email}, Message: ${message}`,
        })
        .then(() => {
          alert("Appointment added successfully and email sent to the expert");
          // Clear form fields after successful submission
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
          setDate("");
          setTime("");
        })
        .catch((err) => {
          alert("Appointment added successfully but failed to send email to the expert");
          console.error('Error sending email:', err);
        });
      })
      .catch((err) => {
        alert("Failed to add appointment");
        console.error('Error adding appointment:', err);
      });
  };

  return (
    <div className="appointment-form-page">
      <GlobalStyles/>
      <h2>Request an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputFirstName" className="form-label">First Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="inputFirstName" 
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputLastName" className="form-label">Last Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="inputLastName" 
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="exampleInputEmail1" 
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputMessage" className="form-label">Message</label>
          <textarea 
            className="form-control" 
            id="inputMessage" 
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputDate" className="form-label">Date</label>
          <input 
            type="date" 
            className="form-control" 
            id="inputDate" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputTime" className="form-label">Time</label>
          <input 
            type="text" 
            className="form-control" 
            id="inputTime" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default AppointmentFormPage;
