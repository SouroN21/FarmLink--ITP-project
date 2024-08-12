const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const nodemailer = require('nodemailer')

router.post("/add", async (req, res) => {
    const { userId, productId, productName, productPrice, imageUrl, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].amount = cart.items[itemIndex].quantity * cart.items[itemIndex].productPrice;
                cart.items[itemIndex].imageUrl = imageUrl;
            } else {
                const amount = quantity * productPrice;
                cart.items.push({
                    product: productId,
                    productName: productName,
                    productPrice: productPrice,
                    imageUrl: imageUrl,
                    quantity: quantity,
                    amount: amount
                });
            }
        } else {
            const amount = quantity * productPrice;
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    productName: productName,
                    productPrice: productPrice,
                    imageUrl: imageUrl,
                    quantity: quantity,
                    amount: amount
                }]
            });
        }
        
        // Recalculate totalAmount for the cart
        cart.totalAmount = cart.items.reduce((total, item) => total + item.amount, 0);
        
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error("Adding to cart failed:", error);
        res.status(500).json({ message: "Adding to cart failed" });
    }
});

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dasunpriyanaveen@gmail.com',
      pass: 'uvxs twre aebt bbal',
    },
  });

router.post("/pay", async (req, res) => {
    const { userId } = req.body;
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Simulate payment processing
        cart.paymentStatus = "Paid"; // Update payment status to "Paid"
        await cart.save();

        // Send payment confirmation email
        await transporter.sendMail({
            from: 'dasunpriyanaveen@gmail.com',
            to: 'dasunpriyanaveen@gmail.com',
            subject: 'Payment Confirmation',
            text: 'Your payment was successful. Thank you for your purchase!',
        });

        res.status(200).json({ message: "Payment successful", cart });
    } catch (error) {
        console.error("Payment processing failed:", error);
        res.status(500).json({ message: "Payment failed" });
    }
});

router.put("/updateOrderPaymentStatus/:orderId", async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const orderId = req.params.orderId;

        const order = await Cart.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({ message: "Payment status updated successfully", updatedOrder: order });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Failed to update payment status" });
    }
});

router.get("/paymentStatusSummary", async (req, res) => {
    try {
        const paidOrdersCount = await Cart.countDocuments({ paymentStatus: 'Paid' });
        const pendingOrdersCount = await Cart.countDocuments({ paymentStatus: 'Pending' });
        const paidOrders = await Cart.find({ paymentStatus: 'Paid' });
        const totalAmountPaid = paidOrders.reduce((total, order) => total + order.totalAmount, 0);
        const allOrders = await Cart.find({});
        const totalAmountAllOrders = allOrders.reduce((total, order) => total + order.totalAmount, 0);
        const pendingAmount = totalAmountAllOrders - totalAmountPaid;
        res.status(200).json({ paidOrdersCount, pendingOrdersCount, totalAmountPaid, pendingAmount });
    } catch (error) {
        console.error("Fetching payment status summary failed:", error);
        res.status(500).json({ message: "Failed to fetch payment status summary" });
    }
});

// GET route to retrieve all carts
router.get("/", async (req, res) => {
    try {
        const carts = await Cart.find({});
        res.status(200).json(carts);
    } catch (error) {
        console.error("Fetching carts failed:", error);
        res.status(500).json({ message: "Failed to fetch carts" });
    }
});

// GET route to retrieve a cart by user ID
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId, paymentStatus: "Pending" });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        // Calculate total amount
        let totalAmount = 0;
        for (const item of cart.items) {
            totalAmount += item.amount * item.totalAmount;
        }
        
        // Include total amount in the response
        cart.totalAmount = totalAmount;
        
        res.status(200).json(cart);
    } catch (error) {
        console.error("Fetching cart failed:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
});

// PUT route to update item quantity in the cart
router.put("/updateQuantity/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        // Find the cart containing the item
        let cart = await Cart.findOne({ "items._id": itemId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the item in the cart's items array
        let itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex > -1) {
            // Update the quantity of the item
            cart.items[itemIndex].quantity = quantity;

            // Update the amount of the item based on the product price
            cart.items[itemIndex].amount = cart.items[itemIndex].productPrice * quantity;

            // Recalculate the total amount for the cart
            let totalAmount = 0;
            for (const item of cart.items) {
                totalAmount += item.amount;
            }
            // Update the total amount for the cart
            cart.totalAmount = totalAmount;

            // Save the changes to the cart
            await cart.save();

            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.error("Updating item quantity failed:", error);
        res.status(500).json({ message: "Failed to update item quantity" });
    }
});

// DELETE route to remove an item from the cart
router.delete("/delete/:itemId", async (req, res) => {
    try {
        let cart = await Cart.findOneAndUpdate(
            { "items._id": req.params.itemId },
            { $pull: { items: { _id: req.params.itemId } } },
            { new: true }
        );
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Deleting item from cart failed:", error);
        res.status(500).json({ message: "Failed to delete item from cart" });
    }
});

const moment = require('moment');

router.delete("/deleteOrder/:orderId", async (req, res) => {
    try {
        const order = await Cart.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if the order was created within the last 24 hours
        const currentDateTime = new Date();
        const orderCreatedAt = new Date(order.createdAt);
        const millisecondsDifference = orderCreatedAt - currentDateTime;
        const hoursDifference = millisecondsDifference / (1000 * 60 * 60);

        console.log("Hours Difference:", hoursDifference); // Log the hours difference

        if (hoursDifference >= 24) {
            return res.status(403).json({ message: "Cannot delete order created more than 24 hours ago" });
        }

        const result = await Cart.findByIdAndDelete(req.params.orderId);
        if (!result) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });

        if (order.paymentStatus == 'Pending' && hoursDifference>= 24*7) {
            return res.status(200).json({ message: "Order deleted successfully" });
        }

    } catch (error) {
        console.error("Deleting order failed:", error);
        res.status(500).json({ message: "Failed to delete order" });
    }
});


// GET route to retrieve cart details by ID
router.get("/get/:cartId", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId);
        if (!cart) {
            return res.status(404).json({ message: "dsadsaCart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Fetching cart by ID failed:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
});
router.get("/total/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        // Calculate total cost of items in the cart
        let totalCost = 0;
        cart.items.forEach(item => {
            totalCost += item.amount;
        });
        
        res.status(200).json({ totalCost });
    } catch (error) {
        console.error("Fetching total cost of cart failed:", error);
        res.status(500).json({ message: "Failed to fetch total cost of cart" });
    }
});


module.exports = router;