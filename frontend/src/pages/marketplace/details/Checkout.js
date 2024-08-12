import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import productService from "../../../redux/features/product/ProductService";
import Footer from "../../../components/footer/Footer";
import axios from "axios"; // Import axios for making HTTP requests
import "./checkout.css";
import AssignDelivery from "../../../components/AssignDelivery";

function Checkout() {
  const { productId, quantity } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isCreditCardValid, setIsCreditCardValid] = useState(false);
  const [shippingPriceFromConsole, setShippingPriceFromConsole] =
    useState(null);

  const location = useLocation();
  const count = location.state.count;

  // Shipping cost and minimum discount
  const shippingCost = shippingPriceFromConsole;
  const minimumDiscount = 5;

  // Function to validate credit card information
  const validateCreditCard = () => {
    const isValid =
      creditCardNumber.trim() !== "" &&
      cardHolder.trim() !== "" &&
      expiry.trim() !== "" &&
      cvc.trim() !== "";
    setIsCreditCardValid(isValid);
  };

  useEffect(() => {
    validateCreditCard();
  }, [creditCardNumber, cardHolder, expiry, cvc]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await productService.getProduct(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    // Function to fetch shipping price from local storage
    const fetchShippingPrice = () => {
      const storedShippingPrice = localStorage.getItem("shippingPrice");
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

  const handleApplyCoupon = () => {
    if (couponCode.trim() === "") {
      setCouponError("Please enter a valid coupon code");
    } else {
      setAppliedCoupon(couponCode);
      setCouponError("");
    }
  };

  const calculateTotalAmount = (price) => {
    const t = price * count;
    const total = t - minimumDiscount;
    const total1 = total + shippingCost;
    return total1;
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/order/add", {
        customer: localStorage.getItem("userId"),
        purchasedItems: [
          {
            product: productId,
            name: product.name,
            price: product.price,
            quantity: count,
          },
        ],
        discountApplied: minimumDiscount,
        shippingCost: shippingCost,
        totalCost: calculateTotalAmount(product.price),
        orderStatus: "Pending",
        orderDate: new Date(),
      });
      await axios.put(`http://localhost:5000/api/products/updateproduct/${productId}`, {
        quantity: product.quantity - count,
      }

    )
      // Show a success notification modal box
      setShowNotification(true);
      setNotificationMessage("Order created successfully!");

      // Optional: Reset the coupon code and applied coupon state
      setCouponCode("");
      setAppliedCoupon("");
    } catch (error) {
      console.error("Checkout failed:", error);
      // Handle checkout failure if necessary
    }
  };

  return (
    <div className="container">
      <div className="window21">
        <div className="order-info">
          <div className="order-info-content">
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {product && (
              <>
                <h2 className="h2-che">Order Summary</h2>
                <div className="line"></div>
                <table className="order-table">
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={product.image.filePath}
                          className="full-width"
                          alt={product.name}
                        />
                      </td>
                      <td>
                        <br /> <span className="thin">{product.name}</span>
                      </td>
                      <td>
                        <div className="quantity">Quantity: {count}</div>
                        <div className="price21">${product.price}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="line"></div>
                <div className="total21">
                  <span style={{ float: "left" }}>
                    <div className="thin dense">Discount</div>
                    <div className="thin dense">Delivery</div>
                    TOTAL
                  </span>
                  <span style={{ float: "right", textAlign: "right" }}>
                    <div className="thin dense">
                      -${(minimumDiscount || 0).toFixed(2)}
                    </div>
                    <div className="thin dense">
                      +${(shippingCost || 0).toFixed(2)}
                    </div>
                    ${calculateTotalAmount(product.price)}
                  </span>
                </div>
                <div className="coupon-section">
                  <input
                    className="coupun-input21"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <button className="coupon-ch21" onClick={handleApplyCoupon}>
                    Apply Coupon
                  </button>
                  {couponError && (
                    <div className="coupon-error">{couponError}</div>
                  )}
                  {appliedCoupon && (
                    <div className="applied-coupon">
                      Applied Coupon: {appliedCoupon}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="credit-info">
          <div className="credit-info-content">
            <img
              src="https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png"
              height="80"
              className="credit-card-image"
              id="credit-card-image"
              alt="Credit card logo"
            />
            Card Number
            <input
              className="input-field21"
              value={creditCardNumber}
              onChange={(e) => setCreditCardNumber(e.target.value)}
            />
            Card Holder
            <input
              className="input-field21"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
            <table className="half-input-table">
              <tbody>
                <tr>
                  <td>
                    {" "}
                    Expires{" "}
                    <input
                      className="input-field21"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </td>
                  <td>
                    CVC{" "}
                    <input
                      className="input-field21"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="pay-btn"
              onClick={handleCheckout}
              disabled={!isCreditCardValid}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div className="delivery-container">
        <AssignDelivery />
      </div>

      {/* Notification Modal */}
      {showNotification && (
        <div className="notification-modal">
          <div className="notification-content">
            <a href="/add">
              <span
                className="close-btn"
                onClick={() => setShowNotification(false)}
              >
                ×
              </span>
            </a>
            <p>{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
