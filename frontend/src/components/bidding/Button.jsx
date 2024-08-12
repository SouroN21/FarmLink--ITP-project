import React from 'react';
import { useHistory } from 'react-router-dom'; // Assuming you're using React Router for navigation

const BuyNowButton = ({ amount }) => {
  //const history = useHistory();

  const handleBuyNow = () => {
    // Navigate to the payment gateway route when the button is clicked
    //history.push('/payment-gateway', { amount }); // You can pass any additional data like amount
  };

  return (
    <button onClick={handleBuyNow} style={{backgroundColor: '#000000' ,color: '#fff',
    padding: '10px 20px',borderRadius: '5px', // Rounded corners
    border: 'none', // No border
    cursor: 'pointer', width:'200px', marginLeft:'50px'} }>Buy Now</button>
  );
};

export default BuyNowButton;
