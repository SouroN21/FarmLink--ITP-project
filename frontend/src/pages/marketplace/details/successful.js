import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const count = localStorage.getItem('count');
  useEffect(() => {
    const fetchDetails = async () => {
      const cartId = localStorage.getItem('cartId');
      const productId = localStorage.getItem('productId');
      

      if (cartId) {
        // Fetch cart details if cartId is available
        try {
          const response = await axios.get(`http://localhost:5000/api/cart/get/${cartId}`);
          setCartDetails(response.data);
        } catch (error) {
          console.error('Error fetching cart details:', error.response?.data || error.message);
        }
      } else if (productId) {
        // Fetch product details if productId is available
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
          const data = response.data;
          setProductDetails({
            ...data,
            price: Number(data.price) // Ensure price is a number
          });
        } catch (error) {
          console.error('Error fetching product details:', error.response?.data || error.message);
        }
      } else {
        console.error('No cart ID or product ID found');
      }
    };

    fetchDetails();
  }, []);

  const placeOrder = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    let orderData;

    if (cartDetails) {
      // Create order with cart details
      orderData = {
        customer: userId,
        purchasedItems: cartDetails.items.map(item => ({
          product: item.product,
          name: item.productName,
          price: item.productPrice,
          imageURL: item.imageUrl,
          quantity: item.quantity,
          amount: item.amount,
        })),
        discountApplied: 0,
        shippingCost: 0,
        totalCost: cartDetails.totalAmount,
        orderStatus: 'Pending',
        orderDate: new Date(),
      };
    } else if (productDetails) {
      // Create order with single product details
      orderData = {
        customer: userId,
        purchasedItems: [{
          product: productDetails._id,
          name: productDetails.name,
          price: productDetails.price,
          imageURL: productDetails.imageUrl,
          quantity: count,
          amount: productDetails.price,
        }],
        discountApplied: 0,
        shippingCost: 0,
        totalCost: productDetails.price,
        orderStatus: 'Pending',
        orderDate: new Date(),
      };
    } else {
      console.error('No valid cart or product details found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/order/add', orderData);
      console.log('Order placed successfully:', response.data);

      // Update product quantities based on cart or single product
      const updateQuantities = async (items) => {
        await Promise.all(items.map(async item => {
          const { data: { quantity } } = await axios.get(`http://localhost:5000/api/products/getproductq/${item.product}`);
          const newQuantity = quantity - item.quantity;
          await axios.put(`http://localhost:5000/api/products/updateproduct/${item.product}`, { quantity: newQuantity });
        }));
      };

      if (cartDetails) {
        await updateQuantities(cartDetails.items);
      } else if (productDetails) {
        const { data: { quantity } } = await axios.get(`http://localhost:5000/api/products/getproductq/${productDetails._id}`);
        await axios.put(`http://localhost:5000/api/products/updateproduct/${productDetails._id}`, { quantity: quantity - count });
        //console.log(q);
        
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
    }
  };

  const handleDoneClick = async () => {
    const cartId = localStorage.getItem('cartId');

    // Place the order
    await placeOrder();

    if (cartId) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/deleteOrder/${cartId}`);
        console.log('Cart deleted successfully');
      } catch (error) {
        console.error('Error deleting cart:', error.response?.data || error.message);
      }
      localStorage.removeItem('cartId');
    } else {
      localStorage.removeItem('productId');
    }
    
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
              <span>
                {cartDetails 
                    ? (typeof cartDetails.totalAmount === 'number' ? cartDetails.totalAmount.toFixed(2) : '0.00') 
                    : (productDetails && typeof productDetails.price === 'number' && typeof Number(count) === 'number' 
                    ? (productDetails.price * Number(count)).toFixed(2) 
                    : '0.00')}
                </span>

            </div>
            <div style={styles.flex}>
              <span>Payment Method:</span>
              <span>Visa ending in 1234</span>
            </div>
            <div style={styles.flex}>
              <span>Date &amp; Time:</span>
              <span>{new Date(cartDetails ? cartDetails.createdAt : productDetails ? productDetails.createdAt : Date.now()).toLocaleString()}</span>
            </div>
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
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  doneButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
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
