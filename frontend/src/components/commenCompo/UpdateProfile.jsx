import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from "../../image/curriculum-vitae.png"



const userId = localStorage.getItem("userId");

const UpdateProfile = ({ userId }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",

    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `http://localhost:5000/users/${userId}`;
                const { data } = await axios.get(url);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:5000/users/${userId}`;
            const { data: updatedUser } = await axios.put(url, formData);
            toast.success('Your data updated!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            console.log("User updated:", updatedUser);

        } catch (error) {
            toast.error('can not update your data', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
            console.error("Failed to update user:", error);

        }
    };


    return (

        <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
            <div className={styles.right}>
                <form className={styles.form_container} onSubmit={handleSubmit}>
                    <h1>Update your Account</h1>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.green_btn}>
                        Update
                    </button>
                </form>
            </div>
        </div>
        <ToastContainer />
        </div>

    );
};

export default UpdateProfile;
