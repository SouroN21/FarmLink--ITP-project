import React, { useState } from "react";
import axios from "axios";

export default function ListBuddy() {
    const [formData, setFormData] = useState({
        fname: "",
        experience: "",
        availability: "",
        location: "",
        email: "",
        phone: "",
        picture: null // State to store the selected image file
    });

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handlePictureChange(e) {
        setFormData({ ...formData, picture: e.target.files[0] }); // Set the selected image file to state
    }

    function sendData(e) {
        e.preventDefault();

        const data = new FormData(); // Create FormData object
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        axios.post("http://localhost:5000/delBuddyModel/add", data, {
            headers: {
                "Content-Type": "multipart/form-data" // Set content type to multipart/form-data
            }
        })
            .then(() => {
                alert("Delivery Buddy Added");
                setFormData({
                    fname: "",
                    experience: "",
                    availability: "",
                    location: "",
                    email: "",
                    phone: "",
                    picture: null // Reset the selected image file
                });
            })
            .catch((err) => {
                console.error("Error occurred while adding delivery buddy:", err);
                alert("Error occurred while adding delivery buddy");
            });
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <form onSubmit={sendData} encType="multipart/form-data" className="w-50">
                <div className="form-group mb-3">
                    <label htmlFor="fname" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fname"
                        placeholder="Enter full name"
                        name="fname"
                        value={formData.fname}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="experience" className="form-label">Experience</label>
                    <input
                        type="text"
                        className="form-control"
                        id="experience"
                        placeholder="Enter experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="availability" className="form-label">Availability</label>
                    <input
                        type="text"
                        className="form-control"
                        id="availability"
                        placeholder="Enter availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        placeholder="Enter location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Enter phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="picture" className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="picture"
                        accept="image/*"
                        onChange={handlePictureChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Submit
                </button>
            </form>
        </div>
    );
}
