import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import StarRating from "./StarRating"; // Import the StarRating component

export default function AddFeedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [starRating, setStarRating] = useState(0); // State for star rating

  function sendData(e) {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }

    const newFeedback = {
      name,
      email,
      message,
      starRating // Include starRating in the newFeedback object
    };

    axios
      .post("http://localhost:5000/feedback/add", newFeedback)
      .then(() => {
        alert("Feedback Added");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("An error occurred. Please try again later.");
      });
  }

  return (
    <div className="container" style={{ backgroundColor: '#009688', padding: '10px', borderRadius: '5px', width: '30%' }}> {/* Adjust the width here */}
      <h2 style={{ color: '#fff' }}>Add your feedback</h2>
      <form onSubmit={sendData}>
        <div className="form-group">
          <label htmlFor="name" style={{ color: '#fff' }}>Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter customer Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" style={{ color: '#fff' }}>Email</label>
          <input
            type="email"
            className={"form-control" + (emailError ? " is-invalid" : "")}
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="message" style={{ color: '#fff' }}>Your message</label>
          <input
            type="text"
            className="form-control"
            id="message"
            placeholder="Enter message"
            style={{ width: '100%', height: '100px' }} // Adjust the height and width here
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="starRating" style={{ color: '#fff' }}>Star Rating</label>
          {/* Render the StarRating component with appropriate props */}
          <StarRating value={starRating} onChange={setStarRating} starStyle={{ borderColor: 'black' }} /> {/* Add starStyle prop with borderColor */}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

// Define PropTypes for the AddFeedback component
AddFeedback.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
    starRating: PropTypes.number,
    setStarRating: PropTypes.func
};
