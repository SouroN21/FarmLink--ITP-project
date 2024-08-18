import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated import

export default function SuccessPage() {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCartDetails = async () => {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        console.error('No cart ID found');
        return;
      }
      console.log(cartId);

      try {
        const response = await axios.get(`http://localhost:5000/api/cart/get/${cartId}`);
        setCartDetails(response.data);
      } catch (error) {
        console.error('Error fetching cart details:', error.response ? error.response.data : error.message);
      }
    };

    fetchCartDetails();
  }, []);

  const placeOrder = async () => {
    const cartId = localStorage.getItem('cartId');
    const userId = localStorage.getItem('userId');
    if (!cartId || !userId) {
      console.error('No cart ID or user ID found');
      return;
    }

    const cart = cartDetails; // Use cartDetails from state
    const orderData = {
      customer: userId,
      purchasedItems: cart.items.map(item => ({
        product: item.product,
        name: item.productName,
        price: item.productPrice,
        imageURL: item.imageUrl, // Use imageUrl from cart details
        quantity: item.quantity,
        amount: item.amount
      })),
      discountApplied: 0, // Replace with actual discount amount if applicable
      shippingCost: 0, // Replace with actual shipping cost if applicable
      totalCost: cart.totalAmount,
      orderStatus: 'Pending',
      orderDate: new Date()
    };

    try {
      // Place the order
      const response = await axios.post('http://localhost:5000/api/order/add', orderData);
      console.log('Order placed successfully:', response.data);

      // Update the quantity of each product in the cart
      await Promise.all(cart.items.map(async item => {
        // Fetch the current quantity of the product
        const { data: { quantity } } = await axios.get(`http://localhost:5000/api/products/getproductq/${item.product}`);

        // Calculate the new quantity after subtracting the ordered quantity
        const newQuantity = quantity - item.quantity;

        // Update the product's quantity
        await axios.put(`http://localhost:5000/api/products/updateproduct/${item.product}`, {
          quantity: newQuantity
        });
      }));

      setShowModal(true); // Show modal on successful order placement
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleDoneClick = async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      console.error('No cart ID found');
      return;
    }

    // Place the order
    await placeOrder();

    try {
      await axios.delete(`http://localhost:5000/api/cart/deleteOrder/${cartId}`);
      console.log('Cart deleted successfully');
    } catch (error) {
      console.error('Error deleting cart:', error.response ? error.response.data : error.message);
    }

    // Clear the cart ID from localStorage
    localStorage.removeItem('cartId');
    
    // Navigate to the home page
    navigate('/*');
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <CircleCheckIcon style={styles.icon} />
            <h1 style={styles.h1}>Payment Successful</h1>
            <p style={styles.p}>
              Thank you for your payment. Your order is being processed.
            </p>
          </div>
          <div style={styles.summary}>
            <div style={styles.flex}>
              <span>Amount Paid:</span>
              <span>${cartDetails ? cartDetails.totalAmount.toFixed(2) : '0.00'}</span>
            </div>
            <div style={styles.flex}>
              <span>Payment Method:</span>
              <span>Visa ending in 1234</span>
            </div>
            <div style={styles.flex}>
              <span>Date &amp; Time:</span>
              <span>{new Date(cartDetails ? cartDetails.createdAt : Date.now()).toLocaleString()}</span>
            </div>
          </div>
          <div style={styles.cartDetails}>
            <h2 style={styles.h2}>Cart Details</h2>
            {cartDetails && cartDetails.items.length > 0 ? (
              <ul style={styles.itemList}>
                {cartDetails.items.map((item) => (
                  <li key={item._id} style={styles.item}>
                    <img src={item.imageUrl} alt={item.productName} style={styles.itemImage} />
                    <span>{item.productName}</span>
                    <span>{item.quantity} x ${item.productPrice.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.empty}>No items in the cart.</p>
            )}
          </div>
          <div style={styles.buttonContainer}>
            <button
              onClick={handleDoneClick}
              style={styles.doneButton}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CircleCheckIcon Component
function CircleCheckIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
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
  cartDetails: {
    marginTop: '1.5rem',
  },
  h2: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
  },
  itemList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e5e7eb',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    marginRight: '0.5rem',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
  },
  doneButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    border: '1px solid transparent',
    borderRadius: '0.375rem',
    color: '#fff',
    backgroundColor: '#111827',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: 'none', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
  icon: {
    color: '#10b981',
    width: '4rem',
    height: '4rem',
  },
};
