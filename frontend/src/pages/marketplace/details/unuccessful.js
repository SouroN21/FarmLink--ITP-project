import { useNavigate } from 'react-router-dom';
import React from 'react';

// Unsuccessful Page Component
export default function UnsuccessfulPage() {

    const navigate = useNavigate();
    const handleTryAgain = () => {
        navigate(-1); // Go back to the previous page
        // Or navigate('/specific-route') to go to a specific route
      };
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <CircleCrossIcon style={styles.icon} />
            <h1 style={styles.h1}>Payment Unsuccessful</h1>
            <p style={styles.p}>
              We encountered an issue with your payment. Please try again or contact support if the issue persists.
            </p>
          </div>
          <div style={styles.summary}>
            <div style={styles.flex}>
              <span>Error Code:</span>
              <span>12345</span>
            </div>
            <div style={styles.flex}>
              <span>Payment Method:</span>
              <span>Visa ending in 1234</span>
            </div>
            <div style={styles.flex}>
              <span>Date &amp; Time:</span>
              <span>April 18, 2024 at 3:45 PM</span>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <a
              onClick={handleTryAgain}
              style={styles.link}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.linkHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.link.backgroundColor}
            >
              Try Again
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// CircleCrossIcon Component
function CircleCrossIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 15l6-6M15 15l-6-6" />
    </svg>
  );
}

// Inline CSS for the component
const styles = {
  body: {
    fontFamily: 'IBM Plex Sans, sans-serif',
    backgroundColor: '#f9fafb',
    margin: 0,
    padding: 0,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: {
    maxWidth: '32rem',
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    boxShadow: '0 0 1rem rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
  },
  h1: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginTop: '1rem',
  },
  p: {
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  summary: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    border: '1px solid transparent',
    borderRadius: '0.375rem',
    color: '#fff',
    backgroundColor: '#dc2626', 
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  linkHover: {
    backgroundColor: '#b91c1c', 
  },
  icon: {
    color: '#dc2626', 
    width: '4rem',
    height: '4rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
};
