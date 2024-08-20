import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './OrdersPage.css'; 
import GlobalStyles from '../../GlobalStyles';


const ProductsAndOrdersPage = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [errorOrders, setErrorOrders] = useState(null);

    const userId = localStorage.getItem('userId');

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/user-products/${userId}`);
                setProducts(response.data);
                setLoadingProducts(false);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setErrorProducts('Failed to fetch products');
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [userId]);

    // Fetch orders for selected product
    useEffect(() => {
        const fetchOrders = async () => {
            if (selectedProductId) {
                setLoadingOrders(true);
                try {
                    const response = await axios.get(`http://localhost:5000/api/order/product/${selectedProductId}`);
                    setOrders(response.data);
                    setLoadingOrders(false);
                } catch (error) {
                   // console.error('Failed to fetch orders:', error);
                    setErrorOrders('No orders');
                    setLoadingOrders(false);
                }
            } else {
                setOrders([]);
            }
        };

        fetchOrders();
    }, [selectedProductId]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/order/updateStatus/${orderId}`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );
            toast.success('Order status updated successfully!');
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/api/order/${orderId}`);
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            toast.success('Order deleted successfully!');
        } catch (error) {
            console.error('Failed to delete order:', error);
            toast.error('Failed to delete order.');
        }
    };

    if (loadingProducts) return <p>Loading products...</p>;
    if (errorProducts) return <p>{errorProducts}</p>;

    return (
        <div className="products-and-orders-page">
            <GlobalStyles />
            <ToastContainer />
            <div className="products-section">
                <h1 className="products-title">My Products</h1>
                {products.length === 0 ? (
                    <p className="no-products">You have no products.</p>
                ) : (
                    <div className="products-list">
                        {products.map(product => (
                            <div
                                key={product._id}
                                className="product-item"
                                onClick={() => {
                                    setSelectedProductId(product._id);
                                    setLoadingOrders(true);
                                    setOrders([]);
                                }}
                            >
                                <p className="product-name">Product Name: {product.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedProductId && (
                <div className="orders-section">
                    {loadingOrders ? (
                        <p className="loading-orders">Loading orders...</p>
                    ) : errorOrders ? (
                        <p className="orders-error">{errorOrders}</p>
                    ) : (
                        <div>
                            <h2 className="orders-title">Orders for Product</h2>
                            {orders.length === 0 ? (
                                <p className="no-orders">No orders found for this product.</p>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-item">
                                            <p className="order-id">Order ID: {order._id}</p>
                                            <p className="order-date">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                            <p className="order-status">Order Status: {order.orderStatus}</p>
                                            <p className="order-total-cost">Total Cost: ${order.totalCost}</p>
                                            <div className="order-products">
                                                {order.relevantProduct.map(product => (
                                                    <div key={product.product._id} className="order-product-item">
                                                        <p className="order-product-name">Product Name: {product.product.name}</p>
                                                        <p className="order-product-price">Price: ${product.product.price}</p>
                                                        <p className="order-product-quantity">Quantity: {product.quantity}</p>
                                                        <p className="order-product-amount">Amount: ${product.amount}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                                                className="update-status-button"
                                            >
                                                Mark as Shipped
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="delete-order-button"
                                            >
                                                Delete Order
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductsAndOrdersPage;
