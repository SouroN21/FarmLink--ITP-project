const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { loginStatus } = require("../middleware/authMiddleware");

// Authentication Routes

router.get("/loggedin", loginStatus);

router.post("/", validateLogin, async (req, res) => {
  try {
    if (req.user) {
      return res.status(400).json({ message: "User already logged in." });
    }
  
    const user = await User.findOne({ email: req.body.email }).select("+password +role");
  
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
  
    const token = user.generateAuthToken();
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', // Added sameSite for additional security
      maxAge: 604800000 // 7 days in milliseconds
    });
    
    return res.status(200).json({
      message: "Logged in successfully",
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error); // Log the error for server-side debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function validateLogin(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
}

module.exports = router;
