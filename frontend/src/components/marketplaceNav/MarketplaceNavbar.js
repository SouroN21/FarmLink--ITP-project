import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useCategory } from '../../customHook/CategoryProvider';
import axios from 'axios';

let userid;

function MarketplaceNavbar({ children, showCategories = true }) {
    const { setCategory } = useCategory();
    const [cart, setCart] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState('');

    const fetchCart = async () => {
        userid = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${userid}`);
            setCart(response.data);
            setTotalAmount(response.data.totalAmount);
        } catch (err) {
            setError(err.message || 'Failed to fetch cart');
        }
    };

    useEffect(() => {
        fetchCart();
        const intervalId = setInterval(() => fetchCart(), 1000); 
        return () => clearInterval(intervalId);
    }, []);

    const handleCategorySelect = (category) => {
        setCategory(category);
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" style={{ marginLeft: "2rem" }}>Home</Nav.Link>
                            <Nav.Link href="/market" style={{ marginLeft: "2rem" }}>Shop</Nav.Link>
                            <Nav.Link href="/products" style={{ marginLeft: "2rem" }}>Products</Nav.Link>
                            {showCategories && (
                                <NavDropdown title="Categories" id="basic-nav-dropdown" style={{ marginLeft: "2rem" }}>
                                    <NavDropdown.Item onClick={() => handleCategorySelect('Vegetable')}>Vegetables</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleCategorySelect('Fruit')}>Fruits</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleCategorySelect('all')}>All Categories</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            <Nav.Link href="/bidding" style={{ marginLeft: "2rem", flex: "1" }}>BiddingHub</Nav.Link>
                            <Nav.Link href="/bidding/bids" style={{ marginLeft: "2rem" }}>Biddings</Nav.Link>

                            <Dropdown align="end">
                                <Dropdown.Toggle variant="success" style={{
                                    marginLeft: "30rem",
                                    width: "80px",
                                    display: "inline",
                                    padding: "10px",
                                    backgroundColor: "rgba(255, 255, 255, 0.5)", 
                                    border: "1px solid lightblue", 
                                    borderRadius: "5px"
                                }}>
                                    <FaShoppingCart style={{
                                        color: "#515783",
                                        fontSize: "24px",
                                        marginRight: "7px",
                                        float: "left"
                                    }} />
                                    <span style={{
                                        backgroundColor: "#6394F8",
                                        borderRadius: "10px",
                                        color: "white",
                                        display: "inline-block",
                                        fontSize: "12px",
                                        lineHeight: "1",
                                        padding: "3px 7px",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {cart ? cart.items.length : 0}
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{
                                    marginLeft: "30rem",
                                    width: "320px",
                                    backgroundColor: "white",
                                    borderRadius: "3px",
                                    padding: "20px",
                                    border: "1px solid #E8E8E8"
                                }}>
                                    <div style={{
                                        borderBottom: "1px solid #E8E8E8",
                                        paddingBottom: "15px",
                                        marginBottom: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                        <FaShoppingCart style={{
                                            color: "#515783",
                                            fontSize: "24px",
                                            marginRight: "7px"
                                        }} />
                                        <div style={{
                                            fontSize: "15px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end"
                                        }}>
                                            <span style={{ color: "#ABB0BE" }}>Total:</span>
                                            <span style={{ color: "#6394F8", fontWeight: "bold" }}>${totalAmount}</span>
                                        </div>
                                    </div>
                                    <Dropdown.Divider style={{ margin: "8px 0" }} />
                                    {cart && cart.items.length > 0 ? (
                                        cart.items.map(item => (
                                            <Dropdown.ItemText key={item.product} style={{
                                                paddingTop: "10px",
                                                fontSize: "16px",
                                                marginBottom: "18px",
                                                color: "#343a40"
                                            }}>
                                                <img src={item.imageUrl} alt={item.productName} style={{
                                                    float: "left",
                                                    marginRight: "12px",
                                                    width: "50px",
                                                    height: "50px"
                                                }} />
                                                <span style={{ display: "block", paddingTop: "10px", fontSize: "16px" }}>
                                                    {item.productName}
                                                </span>
                                                <span style={{ color: "#6394F8", marginRight: "8px" }}>
                                                    ${item.productPrice}
                                                </span>
                                                <span style={{ color: "#ABB0BE" }}>
                                                    Quantity: {item.quantity}
                                                </span>
                                            </Dropdown.ItemText>
                                        ))
                                    ) : (
                                        <Dropdown.ItemText style={{
                                            paddingTop: "10px",
                                            fontSize: "16px",
                                            color: "#343a40"
                                        }}>
                                            Your cart is empty
                                        </Dropdown.ItemText>
                                    )}
                                    <Dropdown.Divider style={{ margin: "8px 0" }} />
                                    
                                    <a href="/cart" style={{
                                        display: "block",
                                        backgroundColor: "#6394F8",
                                        color: "white",
                                        textAlign: "center",
                                        padding: "10px",
                                        borderRadius: "3px",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        marginTop: "10px"
                                    }}>
                                        Check Cart
                                    </a>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                        <Nav>
                            <Nav.Link href="#account" style={{ marginLeft: "5rem" }}>
                                <FaUserCircle /> Account
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    );
}

export default MarketplaceNavbar;
