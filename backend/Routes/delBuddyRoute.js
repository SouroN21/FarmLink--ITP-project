const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { upload } = require("../Utills/fileupload");
const nodemailer = require("nodemailer");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "figbat23@gmail.com",
        pass: "kotg rkcs zupl jbap", 
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Define the schema for Delivery Buddy
const delBuddySchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    picture: {
        type: Object,
        required: true,
    },
});

// Define the model for Delivery Buddy
const DelBuddy = mongoose.model("DelBuddy", delBuddySchema);

// Route to send email
router.post("/send-email", async (req, res) => {
    const { recipientEmail, emailContent } = req.body;

    if (!recipientEmail) {
        return res.status(400).json({ error: "Recipient email is required" });
    }

    try {
        // Send email using nodemailer
        await transporter.sendMail({
            from: "figbat23@gmail.com",
            to: recipientEmail,
            subject: "New Delivery Assignment",
            text: emailContent || "You have been selected as a delivery buddy.",
        });

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        // Send error response
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
    }
});

// Route to add a new delivery buddy
router.post("/add", upload.single("picture"), async (req, res) => {
    const { fname, experience, availability, location, email, phone } = req.body;

    try {
        const newDelBuddy = new DelBuddy({
            fname,
            experience,
            availability,
            location,
            email,
            phone,
            picture: req.file,
        });

        await newDelBuddy.save();
        res.json("Delivery Buddy Added");
    } catch (error) {
        console.error("Error adding delivery buddy:", error);
        res.status(500).json({ error: "Error adding delivery buddy" });
    }
});

// Route to update a delivery buddy
router.put("/update/:id", upload.single("picture"), async (req, res) => {
    const userId = req.params.id;
    const { fname, experience, availability, location, email, phone } = req.body;

    try {
        await DelBuddy.findByIdAndUpdate(userId, {
            fname,
            experience,
            availability,
            location,
            email,
            phone,
            picture: req.file,
        });
        res.status(200).json({ status: "User updated" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user" });
    }
});

// Route to delete a delivery buddy
router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        await DelBuddy.findByIdAndDelete(userId);
        res.status(200).json({ status: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Route to get all delivery buddies
router.get("/", async (req, res) => {
    try {
        const delBuddies = await DelBuddy.find();
        res.json(delBuddies);
    } catch (error) {
        console.error("Error fetching delivery buddies:", error);
        res.status(500).json({ error: "Error fetching delivery buddies" });
    }
});

// Route to get a delivery buddy by ID
router.get("/get/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await DelBuddy.findById(userId);
        res.status(200).json({ status: "User fetched", user });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Error getting user" });
    }
});

module.exports = router;
