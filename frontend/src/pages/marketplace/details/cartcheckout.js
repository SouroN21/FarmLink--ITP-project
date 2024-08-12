import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './cartcheckout.css';
import GlobalStyles from '../../../GlobalStyles';
import AssignDelivery from '../../../components/AssignDelivery';

function CartCheckout() {
    const { cartId } = useParams();
    const [cart, setCart] = useState(null);
    const [totalWithDiscount, setTotalWithDiscount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [shippingPriceFromConsole, setShippingPriceFromConsole] = useState(null);
    const [total, setTotal] = useState(0); // Initialize total state variable
    const discountAmount = 5; 

    useEffect(() => {
        const fetchCartDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/get/${cartId}`);
                setCart(response.data);
                calculateTotal(response.data);
            } catch (error) {
                console.error('Error fetching cart details:', error);
            }
        };

        fetchCartDetails();
    }, [cartId]);

    useEffect(() => {
        // Function to fetch shipping price from local storage
        const fetchShippingPrice = () => {
            const storedShippingPrice = localStorage.getItem('shippingPrice');
            if (storedShippingPrice) {
                setShippingPriceFromConsole(Number(storedShippingPrice));
            }
        };

        // Fetch shipping price initially
        fetchShippingPrice();

        // Set up interval to fetch shipping price every 5 seconds
        const interval = setInterval(fetchShippingPrice, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const calculateTotal = (cartData) => {
        let totalAmount = 0; // Initialize total amount
        let itemsCount = 0;
        cartData.items.forEach((item) => {
            totalAmount += item.amount * item.quantity; // Multiply amount by quantity for each item
            itemsCount += item.quantity;
        });
        
        // Add shipping price and subtract discount amount
        const totalWithDiscount = totalAmount + shippingPriceFromConsole - discountAmount;
       
        setTotal(totalAmount); // Set total amount
        setTotalWithDiscount(totalWithDiscount);
        setTotalItems(itemsCount);
    };

    const handleCouponChange = (event) => {
        setCoupon(event.target.value);
    };

    const applyCoupon = () => {
        // Add coupon logic here
    };

    const placeOrder = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const orderData = {
                customer: userId,
                purchasedItems: cart.items.map(item => ({
                    product: item.product,
                    name: item.productName,
                    price: item.productPrice,
                    imageURL: item.productImageURL,
                    quantity: item.quantity,
                    amount: item.amount
                })),
                discountApplied: discountAmount,
                shippingCost: shippingPriceFromConsole,
                totalCost: totalWithDiscount,
                orderStatus: 'Pending',
                orderDate: new Date()
            };
    
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
    

    const closeModal = async () => {
        setShowModal(false);
        try {                                                                               
            const response = await axios.delete(`http://localhost:5000/api/cart/deleteOrder/${cartId}`);
            console.log('Cart deleted successfully:', response.data);
            // Add additional logic here after deleting the cart
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    };

    // Calculate total to pay
    const totalToPay = total + shippingPriceFromConsole - discountAmount;

    return (
        <div className="cart-card">
            <GlobalStyles/>
            <div className="card-body">
                
                <div className="row">
                    <div className="col-md-7">
                        <div className="left21 border">
                            <div className="row">
                                <span className="cart-header21">Payment</span>
                                <div className="icons21">
                                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="visa"/>
                                    <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="mastercard"/>
                                    <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="maestro"/>
                                </div>
                            </div>
                            <form className="class21">
                                <span>Cardholder's name:</span>
                                <input className="input21-cart" placeholder="Linda Williams"/>
                                <br/><span>Card Number:</span>
                                <input className="input21-cart" placeholder="0125 6780 4567 9909"/>
                                <div className="row">
                                    <div className="col-4"><span>Expiry date:</span>
                                        <input className="input21-cart" placeholder="YY/MM"/>
                                    </div>
                                    <div className="col-4"><span>CVV:</span>
                                        <input id="cvv" className="input21-cart"/>
                                    </div>
                                </div>
                            </form>
                        </div>                        
                    </div>
                    <div className="col-md-5">
                        <div className="right21 border">
                            <div className="cart-header21">Order Summary</div>
                            <p>{totalItems} items</p>
                            {cart && cart.items.map((item) => (
                                <div className="row item" key={item._id}>
                                    <div className="name21"><img className="img-fluid" src={item.imageUrl} alt={item.productName}/></div>
                                    <div className="col-8">
                                        <div className="row21 text-muted">{item.productName}</div>
                                        <div className="row21"><b>$ {item.amount.toFixed(2)}</b></div>
                                        <div className="row21">Qty: {item.quantity}</div>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                            
                            <div className="row lower21">
                                <div className="col text-left">Sub Total</div>
                                <div className="col text-right">$ {total.toFixed(2)}</div> {/* Use 'total' here */}
                            </div>
                            <div className="row lower21">
                                <div className="col text-left">Shipping</div>
                                <div className="col text-right">+ ${shippingPriceFromConsole}</div>
                            </div>
                            <div className="row lower21">
                                <div className="col text-left">Discount</div>
                                <div className="col text-right">- ${discountAmount}</div>
                            </div>
                            <div className="row lower21">
                                <div className="col text-left">Coupon</div>
                                <div className="col text-right">
                                    <input className="coupon-input" type="text" value={coupon} onChange={handleCouponChange} placeholder="Enter Coupon"/>
                                    <button className="coupon-btn" onClick={applyCoupon}>Apply Coupon</button>
                                </div>
                            </div>
                            <div className="row lower21">
                                <div className="col text-left"><b>Total to pay</b></div>
                                <div className="col text-right"><b>$ {totalToPay.toFixed(2)}</b></div>
                            </div>
                            <button className="button-27" onClick={placeOrder}>Place order</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="delivery-container">
                <AssignDelivery />
            </div>
            {showModal && (
                <div className="cart-modal">
                    <div className="cart-modal-content">
                        <a href='/add'><span className="cart-close" onClick={closeModal}>&times;</span></a>
                        <p>Your order has been placed successfully!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartCheckout;
