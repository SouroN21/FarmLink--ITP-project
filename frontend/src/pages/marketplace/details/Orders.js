import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Cart.css';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [paidOrdersCount, setPaidOrdersCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [totalAmountPaid, setTotalAmountPaid] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const componentRef = useRef();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/cart');
                setOrders(response.data);
                setFilteredOrders(response.data); // Initialize filtered orders with all orders
                // Fetch payment status summary
                const summaryResponse = await axios.get('http://localhost:5000/api/cart/paymentStatusSummary');
                setPaidOrdersCount(summaryResponse.data.paidOrdersCount);
                setPendingOrdersCount(summaryResponse.data.pendingOrdersCount);
                setTotalAmountPaid(summaryResponse.data.totalAmountPaid);
                setPendingAmount(summaryResponse.data.pendingAmount);
            } catch (err) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Function to handle search query change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        // Filter orders based on search query
        const filtered = orders.filter(order => 
            order._id.toLowerCase().includes(query) ||
            order.user.toLowerCase().includes(query) ||
            order.items.some(item => item.productName.toLowerCase().includes(query))
        );
        setFilteredOrders(filtered);
    };

    const handleUpdatePopup = (order) => {
        setSelectedOrder(order); // Update selectedOrder state when the Update button is clicked
        setUpdatedPaymentStatus(order.paymentStatus); // Initialize updatedPaymentStatus with the current payment status of the selected order
        setShowUpdatePopup(true);
    };

    const handleCloseUpdatePopup = () => {
        setSelectedOrder(null);
        setShowUpdatePopup(false);
    };

    const handleUpdatePaymentStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/cart/updateOrderPaymentStatus/${selectedOrder._id}`, { paymentStatus: updatedPaymentStatus });
            if (response.status === 200) {
                // Update the payment status of the selected order in the orders state
                const updatedOrders = orders.map(order => {
                    if (order._id === selectedOrder._id) {
                        return { ...order, paymentStatus: updatedPaymentStatus };
                    }
                    return order;
                });
                // Update both orders and filteredOrders state
                setOrders(updatedOrders);
                setFilteredOrders(updatedOrders);
                setShowUpdatePopup(false);
            } else {
                alert('Failed to update payment status');
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment status');
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/deleteOrder/${orderId}`);
            if (response.status === 200) {
                // Remove the deleted order from the orders state
                const updatedOrders = orders.filter(order => order._id !== orderId);
                setOrders(updatedOrders);
                toast.success('Order deleted successfully');
                
            } else {
                alert('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Cannot delete order created more than 24 hours ago');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>All Orders</h1>

            <div className="search-container" style={{ width: "470px", margin: "0 auto 25px" }}>
                <input
                    type="text"
                    placeholder="Search by Order ID or User ID"
                    value={searchQuery}
                    style={{ width: "100%", height: "47px", padding: "5px" }}
                    onChange={handleSearchChange}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
    <div style={{ flexBasis: "24%" }}>
        <div className="card">
            <h2 style={{fontSize: "17px", textAlign: "center"}}>Paid Orders Count</h2>
            <p style={{fontSize: "25px", textAlign: "center"}}>{paidOrdersCount}</p>
        </div>
    </div>
    <div style={{ flexBasis: "24%" }}>
        <div className="card">
            <h2 style={{fontSize: "17px", textAlign: "center"}}>Pending Orders Count</h2>
            <p style={{fontSize: "25px", textAlign: "center"}}>{pendingOrdersCount}</p>
        </div>
    </div>
    <div style={{ flexBasis: "24%" }}>
        <div className="card">
            <h2 style={{fontSize: "17px", textAlign: "center"}}>Total Amount Paid</h2>
            <p style={{fontSize: "25px", textAlign: "center"}}>${totalAmountPaid.toFixed(2)}</p>
        </div>
    </div>
    <div style={{ flexBasis: "24%" }}>
        <div className="card">
            <h2 style={{fontSize: "17px", textAlign: "center"}}>Pending Amount</h2>
            <p style={{fontSize: "25px", textAlign: "center"}}>${pendingAmount.toFixed(2)}</p>
        </div>
    </div>
</div>
            <table ref={componentRef}>
                <thead>
                    <tr>
                        <th style={{fontSize: "25px"}}>Order ID</th>
                        <th style={{fontSize: "25px"}}>User ID</th>
                        <th style={{fontSize: "25px"}}>Products</th>
                        <th style={{fontSize: "25px"}}>Quantity</th>
                        <th style={{fontSize: "25px"}}>Prduct Price</th>
                        <th style={{fontSize: "25px"}}>Total Amount</th>
                        <th style={{fontSize: "25px"}}>Payment Status</th>
                        <th style={{fontSize: "25px"}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order._id}>
                            <td style={{fontSize: "16px"}}>{order._id}</td>
                            <td style={{fontSize: "16px"}}>{order.user}</td>
                            <td style={{fontSize: "16px"}}>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item._id}>{item.productName}</li>
                                    ))}
                                </ul>
                            </td>
                            <td style={{fontSize: "16px"}}>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item._id}>{item.quantity}</li>
                                    ))}
                                </ul>
                            </td>
                            <td style={{fontSize: "16px"}}>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item._id}>${(item.productPrice).toFixed(2)}</li>
                                    ))}
                                </ul>
                            </td>
                            <td style={{fontSize: "16px"}}>${order.totalAmount.toFixed(2)}</td>
                            <td style={{fontSize: "16px"}}>{order.paymentStatus}</td>
                            <td style={{fontSize: "16px"}}>
                                <button onClick={() => handleUpdatePopup(order)}>Update</button>
                                <button onClick={() => handleDeleteOrder(order._id)} style={{backgroundColor: "red"}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handlePrint}>Print Orders</button>
            {showUpdatePopup && (
                <div className="popup">
                    <div className="popup-content" style={{ width: "586px" }}>
                        <h2>Update Payment Status</h2>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <label style={{ fontSize: "26px", marginRight: "10px" }}>New Payment Status:</label>
                            <select value={updatedPaymentStatus} onChange={(e) => setUpdatedPaymentStatus(e.target.value)} style={{ fontSize: "15px" }}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Under Review">Under Review</option>
                            </select>
                        </div>
                        <div className="button-container">
                            <button onClick={handleUpdatePaymentStatus}>Update</button>
                            <button onClick={handleCloseUpdatePopup} style={{backgroundColor: "red"}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;