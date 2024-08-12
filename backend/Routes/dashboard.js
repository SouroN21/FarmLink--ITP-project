const express = require('express');
const { authenticate, isAdmin, isFarmer, isBuyer } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/dashboard", authenticate, (req, res) => {
    if (req.user.role === "admin") {
      res.send("Admin dashboard");
    } else if (req.user.role === "farmer") {
      res.send("Farmer dashboard");
    } else if (req.user.role === "buyer") {
      res.send("Buyer dashboard");
    } else if (req.user.role === "deliver") {
      res.send("Delivery dashboard");
    } else if (req.user.role === "expert") {
      res.send("Expert dashboard");
    }
  });
  
  router.get("/admin/dashboard", authenticate, isAdmin, (req, res) => {
    res.send("Admin dashboard");
  });
  
  router.get("/farmer/dashboard", authenticate, isFarmer, (req, res) => {
    res.send("Farmer dashboard");
  });
  
  router.get("/buyer/dashboard", authenticate, isBuyer, (req, res) => {
    res.send("Buyer dashboard");
  });

  router.get("/delivery/dashboard", authenticate, isDelivery, (req, res) => {
    res.send("Delivery dashboard");
  });
  
  router.get("/expert/dashboard", authenticate, isExpert, (req, res) => {
    res.send("Expert dashboard");
  });

  module.exports = router;