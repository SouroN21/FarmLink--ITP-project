import React, { useState } from "react";
import axios from "axios";

export default function AddDelivery() {
    const [fname, setFname] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [shippingPrice, setShippingPrice] = useState(() => {
        return localStorage.getItem("shippingPrice") || null;
    });
    function sendData(e) {
        e.preventDefault();
        
        const newDelivery = {
            fname,
            address,
            city,
            postalCode,
            phone
        };

        axios.post("http://localhost:5000/delivery/add", newDelivery)
            .then(() => {
                alert("Delivery info added");
                setFname("");
                setAddress("");
                setCity("");
                setCode("");
                setPhone("");
            })
            .catch((err) => {
                console.error("Error occurred while adding delivery info:", err);
                alert("Error occurred while adding delivery info");
            });
    }

    function calculateShippingPrice(city) {
        let price = 0;
        const lowercaseCity = city.toLowerCase();
  
        switch (lowercaseCity) {
            case "kandy":
                price = 355;
                break;
            case "colombo":
                price = 350;
                break;
            case "jaffna":
                price = 400;
                break;
            case "galle":
                price = 360;
                break;
            case "trincomalee":
                price = 380;
                break;
            case "nuwaraeliya":
                price = 390;
                break;
            default:
                price = 250;
                alert("Invalid city. Default shipping price applied.");
                break;
        }
        localStorage.setItem("shippingPrice", price);
        setShippingPrice(price);
    }
  
    return (
        <div className="d-flex flex-column align-items-center">
            <form onSubmit={sendData} className="w-50">
                <div className="form-group">
                    <label htmlFor="fname" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fname"
                        placeholder="Enter your full name"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="postalCode"
                        placeholder="Enter the postal code of your city"
                        value={postalCode}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Submit
                </button>
            </form>

            <div className="rounded-corner-box mt-3 p-3 bg-lightblue">
                <h4>Calculate Shipping Price</h4>
                <div className="form-group">
                    <label htmlFor="city" className="form-label">Enter City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button onClick={() => calculateShippingPrice(city)} className="btn btn-success w-100">
                    Calculate Shipping Price
                </button>
                {shippingPrice !== null && (
                    <div className="mt-3">
                        <h4>Shipping Price: LKR {shippingPrice}</h4>
                        {/* You can add more details here, such as the real-time location of the receiver */}
                    </div>
                )}
            </div>
        </div>
    );
}
