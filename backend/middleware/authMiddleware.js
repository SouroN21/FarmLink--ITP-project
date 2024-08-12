const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");



const authenticate = (req, res, next) => {
  

  // Retrieve the token from cookies
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
  
  const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access denied. Admin role required.");
    }
    next();
  };
  
  const isFarmer = (req, res, next) => {
    if (req.user.role !== "farmer") {
      return res.status(403).send("Access denied. Farmer role required.");
    }
    next();
  };
  
  const isBuyer = (req, res, next) => {
    if (req.user.role !== "buyer") {
      return res.status(403).send("Access denied. Buyer role required.");
    }
    next();
  };

  const isDelivery = (req, res, next) => {
    if (req.user.role !== "delivery") {
      return res.status(403).send("Access denied. Delivery role required.");
    }
    next();
  };

  const isExpert = (req, res, next) => {
    if (req.user.role !== "expert") {
      return res.status(403).send("Access denied. Expert role required.");
    }
    next();
  };



  // ashen

  const loginStatus = expressAsyncHandler(async (req, res) => {
   
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.json(false)
    }
    // Verify token

    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY)

    if (verified) {
        return res.json(true)
    }
    return res.json(false)
});


  module.exports = {loginStatus,authenticate , isAdmin, isBuyer, isFarmer, isDelivery, isExpert};