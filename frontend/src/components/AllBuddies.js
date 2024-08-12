import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AllBuddies() {
  const [buddies, setBuddies] = useState([]);
  const [userCity, setUserCity] = useState(""); // State to store user's input city

  useEffect(() => {
    axios.get("http://localhost:5000/delBuddyModel/") // Fetch all delivery buddies
      .then((res) => {
        setBuddies(res.data);
      })
      .catch((err) => {
        console.error("Error fetching delivery buddies:", err);
        alert("Error fetching delivery buddies");
      });
  }, []);

  // Function to handle user city input change
  const handleUserCityChange = (e) => {
    setUserCity(e.target.value);
  };

  const handleSearch = () => {
    // Implement search functionality if needed
    // For now, let's just log the selected city
    console.log("Selected city:", userCity);
  };

  const handleSelect = (buddyId, buddyEmail) => {
    console.log("Selected buddy ID:", buddyId);
    console.log("Selected buddy email:", buddyEmail);

    axios.post("http://localhost:5000/delBuddyModel/send-email", {
      recipientEmail: buddyEmail,
      emailContent: `Congratulations! You're Our New Delivery Buddy

      Hey [Recipient's Name],
      
      Exciting news! You've been chosen as one of our delivery buddies. 🚚
      
      Here are the details you provided:
      
      Full Name: [Recipient's Full Name]
      Address: [Recipient's Address]
      City: [Recipient's City]
      Postal Code: [Recipient's Postal Code]
      Phone Number: [Recipient's Phone Number]
      
      We're thrilled to have you on board. Your help in ensuring timely deliveries is invaluable to us.
      
      Looking forward to working together!
      
      Best regards,
      FarmLink.`,
    })
    .then((response) => {
      console.log(response.data);
      alert("Email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert("Error sending email");
    });
  };

  // Filter recommended buddies based on user's input city
  const recommendedBuddies = buddies.filter(
    (buddy) => buddy.location.toLowerCase() === userCity.toLowerCase()
  );

  // Filter other buddies (non-recommended) based on user's input city
  const otherBuddies = buddies.filter(
    (buddy) => buddy.location.toLowerCase() !== userCity.toLowerCase()
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Select your delivery buddy</h1>

      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        {/* Search box for user to enter their city */}
        <input
          type="text"
          value={userCity}
          onChange={handleUserCityChange}
          placeholder="Search your city..."
          style={{ flex: 1, height: "40px", padding: "0 10px", borderRadius: "20px 0 0 20px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSearch} style={{ height: "40px", padding: "0 20px", borderRadius: "0 20px 20px 0", border: "none", backgroundColor: "#4CAF50", color: "white", cursor: "pointer" }}>Search</button>
      </div>

      {/* Display recommended buddies */}
      {userCity && recommendedBuddies.length > 0 && (
        <div style={{ marginBottom: "50px" }}>
          <h2>Recommended</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "50px" }}>
            {recommendedBuddies.map((buddy, index) => (
              <div key={index} style={{ width: "200px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", borderRadius: "5px", padding: "16px", textAlign: "center", marginBottom: "30px" }}>
                <img src={`http://localhost:5000/uploads/${buddy.picture.filename}`} alt="Buddy" style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "12px" }} />
                <div style={{ marginBottom: "12px" }}>
                  <strong>{buddy.fname}</strong>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Experience:</strong> {buddy.experience}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Availability:</strong> {buddy.availability}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Location:</strong> {buddy.location}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Email:</strong> {buddy.email}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Phone:</strong> {buddy.phone}
                </div>
                <button onClick={() => handleSelect(buddy._id, buddy.email)} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", padding: "8px 16px", cursor: "pointer", textDecoration: "none" }}>Select</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display other buddies */}
      <div>
        <h2>All Listings</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "50px" }}>
          {otherBuddies.map((buddy, index) => (
            <div key={index} style={{ width: "200px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", borderRadius: "5px", padding: "16px", textAlign: "center", marginBottom: "30px" }}>
              <img src={`http://localhost:5000/uploads/${buddy.picture.filename}`} alt="Buddy" style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "12px" }} />
              <div style={{ marginBottom: "12px" }}>
                <strong>{buddy.fname}</strong>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Experience:</strong> {buddy.experience}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Availability:</strong> {buddy.availability}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Location:</strong> {buddy.location}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Email:</strong> {buddy.email}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Phone:</strong> {buddy.phone}
              </div>
              <button onClick={() => handleSelect(buddy._id, buddy.email)} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", padding: "8px 16px", cursor: "pointer", textDecoration: "none" }}>Select</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
