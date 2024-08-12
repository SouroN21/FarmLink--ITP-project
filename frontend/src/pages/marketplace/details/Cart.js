import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyles from '../../../GlobalStyles';
let userid;
function Cart() {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            userid = localStorage.getItem('userId');
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${userid}`);
                setCart(response.data);
                setTotalAmount(response.data.totalAmount);
            } catch (err) {
                setError(err.message || 'Failed to fetch cart');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);
    console.log(userid);
    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/delete/${itemId}`);
            // Remove deleted item from cart
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item._id !== itemId),
            }));
            toast.success('Item deleted successfully!');
        } catch (err) {
            console.error('Error deleting item from cart:', err);
            toast.error('Failed to delete item from cart.');
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/cart/updateQuantity/${itemId}`, { quantity: newQuantity });
            // Update quantity for the item in the cart
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item),
            }));
            setTotalAmount(response.data.totalAmount);
        } catch (err) {
            console.error('Error updating item quantity:', err);
            toast.error('Failed to update item quantity.');
        }
    };

    const handleCheckout = () => {
        // Redirect to the correct checkout page with cart ID
        window.location.href = `/cartcheckout/${cart._id}`;
    };
    

    

   

    if (error) {
        return <div style={{marginLeft: "40rem" , alignItems:"center"}}><GlobalStyles>/</GlobalStyles>Cart is empty.</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div style={{ marginTop: '100px', padding: '0 15px' }}>
                <div style={{
                    marginBottom: '30px',
                    border: '0',
                    borderRadius: '8px',
                    boxShadow: '1px 5px 24px 0 rgba(68,102,242,.05)'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #f6f7fb',
                        padding: '24px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px'
                    }}>
                    
                    </div>
                    <div style={{
                        padding: '30px',
                        backgroundColor: 'transparent'
                    }}>
                        <div style={{ textAlign: 'center' }}>
    <img
        src="https://i.imgur.com/dCdflKN.png"
        width="130"
        height="130"
        alt="Empty Cart"
        style={{ display: 'block', margin: '0 auto 1rem auto' }}
    />
    <h3 style={{ fontSize: '1.5rem' }}>
        <strong>Your Cart is Empty</strong>
    </h3>
    <h4 style={{ fontSize: '1.25rem' }}>Add something to make me happy :)</h4>
    <a href="/*" style={{
        display: 'inline-block',
        padding: '10px 20px',
        marginTop: '1rem',
        backgroundColor: '#4466f2',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer'
    }}>Continue Shopping</a>
</div>

                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="check-card">
            <GlobalStyles/>
            <div className="row21">
                <div className="col-md-8 check-cart">
                    <div className="check-title">
                        <div className="row21">
                            <div className="col"><h4><b>Shopping Cart</b></h4></div>
                            <div className="col align-self-center text-right text-muted">{cart.items.length} items</div>
                        </div>
                    </div>
                    {cart.items.map((item) => (
                        <div className="row border-top border-bottom" key={item._id}>
                            <div className="row check-main align-items-center">
                                <div className="col-2"><img className="check-img-fluid" src={item.imageUrl} alt={item.productName} /></div>
                                <div className="col">
                                    <div className="row text-muted">{item.category}</div>
                                    <div className="row21">{item.productName}</div>
                                </div>
                                <div className="col">
                                    <input className="check-input"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col">$ {(item.quantity * item.productPrice).toFixed(2)}</div>
                                <div className="col">
                                    <button onClick={() => handleDeleteItem(item._id)} className="check-close">&#10005;</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="back-to-shop"><a href="/market" className="back-btn">Back to shop</a><span className="text-muted"></span></div>
                </div>
                <div className="col-md-4 check-summary">
                    <div><h5 className="check-h1"><b>Summary</b></h5></div>
                    <hr className="check-hr"/>
                    <div className="row">
                        <div className="col" style={{ paddingLeft: 0 }}>ITEMS {cart.items.length}</div>
                        <div className="col text-right"> $ {totalAmount.toFixed(2)}</div>
                    </div>
                    
                    <div className="row" style={{ borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0' }}>
                        <div className="col">TOTAL PRICE</div>
                        <div className="col text-right"> $ {totalAmount.toFixed(2)}</div>
                    </div>
                    <button className="check-btn" onClick={handleCheckout}>CHECKOUT</button>
                </div>
            </div>
        </div>
    );
}



export default Cart;