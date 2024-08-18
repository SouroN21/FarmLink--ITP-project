const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser")
const path = require("path");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const userManage = require("./routes/userManage");
const productRoute = require("./Routes/productRoute");
const paymentRouter =require("./Routes/paymentRouter");
const deliveryRouter = require("./Routes/deliveryRoute.js");
const deliBuddyRouter = require("./Routes/delBuddyRoute.js"); 
const appointmentRoutes = require('./Routes/appointmentRoute');
const expertListingRoute = require('./Routes/expertListingRoute')
const offerRouter = require("./Routes/offersRoute");
const feedbackRouter=require("./routes/feedbacks.js");
const cartRoutes =require("./Routes/cartRoutes");
const orderRoutes = require("./Routes/orderRouter");
const nodemailer = require('nodemailer');
const buyerReqRoute =require("./Routes/BuyerReqRoute");
const biddingRoute = require('./Routes/biddingRoute');
const pay =require("./Routes/pay.js");
const PORT = process.env.PORT || 2001;
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:["http://localhost:3000",`${FRONTEND_URL}`],
    credentials: true,
}));

// Route Middleware


// Routes from Profile_Management branch
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(userManage);
app.use("/api/pay",pay);
app.use("/api/products", productRoute);
app.use("/api/payment", paymentRouter);
app.use("/delivery", deliveryRouter);
app.use("/delBuddyModel", deliBuddyRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/appointments",appointmentRoutes)
app.use("/expertlisting", expertListingRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/offers", offerRouter);
app.use("/feedback",feedbackRouter);

//routes for bidding management
app.use("/api/buyer", buyerReqRoute);
app.use('/api/bidding', biddingRoute);

// Route from main branch
app.get("/", (req, res) => {
    res.send("Home page");
});


// Yuwani 
app.use("/feedback",feedbackRouter);

// Nodemailer code for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com', // your email
      pass: 'your_password' // your password
    }
  });
  
  app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: 'admin_email@gmail.com', // admin's email
      subject: 'New Feedback Added',
      text: `New feedback from ${name} (${email}): ${message}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Email could not be sent');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });
  
// Add the PUT route handler for updating feedback status
app.put('/feedback/update/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedFeedback = await Feedback.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
      res.status(200).json({ status: 'Feedback updated', updatedFeedback });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'Error with updating data', error: err.message });
    }
  });














// Connect to MongoDB and start the server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("MongoDB Connected");
            console.log(`Server Running on Port ${PORT}`);
        });
    });
