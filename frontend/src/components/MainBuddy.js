import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component

function MainBuddy() {
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar" style={sidebarStyle}>
        <h2>Main Delivery Page</h2>
        <p>This is the Main Delivery page content.</p>
        <Link to="/assign">
          <button style={buttonStyle}>Assign Delivery</button>
        </Link>
        <Link to="/view">
          <button style={buttonStyle}>View Delivery Information</button>
        </Link>
      </div>

      <div className="main-content">
        {/* Add your main content here */}
      </div>
    </div>
  );
}

// Inline styles
const sidebarStyle = {
  padding: '20px',
  color: 'black', // Changed text color to black
  width: '250px',
};

const buttonStyle = {
  backgroundColor: '#4CAF50', // Darker green color
  color: 'white',
  padding: '10px 20px',
  marginBottom: '10px',
  display: 'block',
  width: '100%',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'center',
  textDecoration: 'none',
  transition: 'background-color 0.3s',
};

export default MainBuddy;
