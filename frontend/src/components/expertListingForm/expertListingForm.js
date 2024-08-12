// ExpertForm component
import React, { useState, useEffect } from 'react';
import './expertListingForm.scss';
import ExpertDetails from '../expertList/expertList'; // Import the ExpertDetails component

const ExpertForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
    location: '',
    picture: null,
  });
  const [experts, setExperts] = useState([]);
  const expertiseOptions = [
    'Animal science',
    'Horticulture',
    'Soil science',
    'Agricultural business',
    'Agricultural economics',
    'Agriculture science',
    'Food science',
    'Plant science',
  ];

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch('http://localhost:5000/expertlisting');
        if (response.ok) {
          const data = await response.json();
          setExperts(data);
        } else {
          console.error('Failed to fetch experts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
    fetchExperts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('expertise', formData.expertise);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('picture', formData.picture);

    try {
      const response = await fetch('http://localhost:5000/expertlisting/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const newExpert = await response.json();
        console.log('Expert added successfully:', newExpert);
        alert('Expert added successfully!');
        // You can redirect or perform any other action here
      } else {
        console.error('Error adding expert:', response.statusText);
        alert('Error adding expert. Please try again.');
      }
    } catch (error) {
      console.error('Error adding expert:', error);
      alert('Error adding expert. Please try again.');
    }
  };

  return (
    <div>
      
      <div className="form-container">
        <h1 className="form-title">Add Expert Farmer</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="name">Name:</label><br />
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br /><br />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label><br />
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />
          </div>
          
          <div className="form-group">
            <label htmlFor="expertise">Expertise:</label><br />
            <select id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} required>
              <option value="">Select expertise</option>
              {expertiseOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select><br /><br />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location:</label><br />
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required /><br /><br />
          </div>
          
          <div className="form-group">
            <label htmlFor="picture">Picture:</label><br />
            <input type="file" id="picture" name="picture" accept="image/*" onChange={handleFileChange} required /><br /><br />
          </div>
          
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ExpertForm;
