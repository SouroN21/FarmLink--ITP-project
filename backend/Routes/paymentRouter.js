const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Payment = require("../Models/payment");

// Create a new payment
router.route("/add").post((req, res) => {
    const { holdername, email, cardNumber, expiry, cvv, address, city, state, zipcode } = req.body;

    const newPayment = new Payment({
        holdername,
        email,
        cardNumber,
        expiry,
        cvv,
        address,
        city,
        state,
        zipcode
    });

    newPayment.save()
        .then(() => {
            res.json("Payment Added");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "Error", error: err.message });
        });
});

// Retrieve all payments
router.get("/", (req, res) => {
    Payment.find()
        .then((payment) => {
            res.json(payment)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "Error", error: err.message });
        });
});

// Update a payment by ID
router.route("/update/:id").put(async (req, res) => {
    let payId = req.params.id;
    const { holdername, email, cardNumber, expiry, cvv, address, city, state, zipcode } = req.body;
    try {
        const updatePayment = {
            holdername,
            email,
            cardNumber,
            expiry,
            cvv,
            address,
            city,
            state,
            zipcode
        }
        const update = await Payment.findByIdAndUpdate(payId, updatePayment, { new: true });

        if (!update) {
            return res.status(404).json({ status: "Error", error: "Payment not found" });
        }

        res.status(200).json({ status: "Payment Updated", user: update });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", error: err.message });
    }
});

// Delete a payment by ID
router.route("/delete/:id").delete(async (req, res) => {
    let payId = req.params.id;

    await Payment.findByIdAndDelete(payId)
        .then(() => {
            res.status(200).send({ status: "Payment Deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error With Delete Payment", error: err.message });
        });
});

// Fetch payment details by ID
router.get("/get/:id", async (req, res) => {
    try {
        const payId = req.params.id;
        const payment = await Payment.findById(payId);

        if (!payment) {
            return res.status(404).json({ status: "Error", error: "Payment not found" });
        }

        res.status(200).json({ status: "Payment Fetch", payment: payment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "Error with get Payment", error: err.message });
    }
});




// Search for payment by card number
router.get("/getByCardNumber/:cardNumber", async (req, res) => {
    try {
        const cardNumber = req.params.cardNumber;
        const payment = await Payment.findOne({ cardNumber: cardNumber });

        if (!payment) {
            return res.status(404).json({ status: "Error", error: "Payment not found" });
        }

        res.status(200).json({ status: "Payment Fetch", payment: payment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "Error with get Payment", error: err.message });
    }
});

module.exports = router;
