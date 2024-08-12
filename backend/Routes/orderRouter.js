const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
/*const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dasunpriyanaveen@gmail.com',
        pass: 'uvxs twre aebt bbal',
    },
});*/

// Define the function to generate a custom order ID
function generateCustomOrderId() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().substr(-2); // Last two digits of the year
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zero if needed
    const day = currentDate.getDate().toString().padStart(2, '0'); // Day with leading zero if needed

    // Generate random alphanumeric string of length 6
    const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();

    // Concatenate components to form the custom order ID
    const customOrderId = `${year}${month}${day}-${randomString}`;
    
    return customOrderId;
}

// Add Order Route
router.post("/add", async (req, res) => {
    try {
        const {
            customer,
            purchasedItems,
            discountApplied,
            shippingCost,
            totalCost,
            orderStatus,
            orderDate
        } = req.body;

        const newOrder = new Order({
            customer,
            purchasedItems,
            discountApplied,
            shippingCost,
            totalCost,
            orderStatus,
            orderDate
        });
        

        const savedOrder = await newOrder.save();

       /* // Send email notification
        await transporter.sendMail({
            from: 'dasunpriyanaveen@gmail.com',
            to: 'dasunpriyanaveen@gmail.com', // Change this to the customer's email
            subject: 'Order Confirmation',
            text: 'Your order has been successfully placed. Thank you for your purchase!',
        });*/

        res.status(201).json({ message: "Order added successfully", order: savedOrder });
    } catch (error) {
        console.error("Adding order failed:", error);
        res.status(500).json({ message: "Failed to add order" });
    }
});

// Get Order by ID Route
router.get("/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Fetching order by ID failed:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
});

// Delete Order by ID Route
router.delete("/:orderId", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("Deleting order failed:", error);
        res.status(500).json({ message: "Failed to delete order" });
    }
});

// Get All Orders Route
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetching all orders failed:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Delete Orders by Customer ID Route
router.delete("/delete/:customerId", async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // Find and delete orders associated with the customer ID
        const deletedOrders = await Order.deleteMany({ customer: customerId });

        if (deletedOrders.deletedCount === 0) {
            return res.status(404).json({ message: "No orders found for this customer" });
        }

        res.status(200).json({ message: "Orders deleted successfully", deletedOrders });
    } catch (error) {
        console.error("Deleting orders failed:", error);
        res.status(500).json({ message: "Failed to delete orders" });
    }
});

// Update Order Status Route
router.put("/updateStatus/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const newStatus = req.body.status; // Assuming the new status is provided in the request body

        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully", updatedOrder });
    } catch (error) {
        console.error("Updating order status failed:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
});



module.exports = router;
