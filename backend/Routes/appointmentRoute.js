// appointmentRoute.js
const express = require('express');
const router = express.Router();
const Appointment = require('../Models/appointmentModel');
const Expertlist = require('../Models/expertListingModel'); // Import Expertlist model
const nodemailer = require('nodemailer');

// Function to send appointment confirmation email to the expert
async function sendAppointmentEmailToExpert(expertEmail, subject, body) {
    try {
      // Create a nodemailer transporter using your SMTP settings
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'henryjhone10@gmail.com', // Your email
          pass: 'zivr rjqh mxmt edsl', // Your password or app-specific password
        },
      });
  
      // Define email options
      let mailOptions = {
        from: 'henryjhone10@gmail.com',
        to: expertEmail,
        subject: subject,
        html: body,
      };
  
      // Send the email
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent to expert: ' + info.response);
    } catch (error) {
      console.error('Error sending appointment email to expert:', error);
      throw error;
    }
  }
  
  // Route to send email
  router.post('/send-email', async (req, res) => {
    try {
      const { expertId, subject, body } = req.body;
      
      // Retrieve expert email based on expertId
      const expert = await Expertlist.findById(expertId);
      if (!expert) {
        return res.status(404).json({ error: 'Expert not found' });
      }
  
      // Send email to expert
      await sendAppointmentEmailToExpert(expert.email, subject, body);
  
      // Send success response
      res.status(200).send("Email sent successfully");
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  });

  // Function to send appointment confirmation email to the user
async function sendAppointmentConfirmationEmailToUser(userEmail, subject, body) {
  try {
      // Create a nodemailer transporter using your SMTP settings
      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: 'henryjhone10@gmail.com', // Your email
              pass: 'zivr rjqh mxmt edsl', // Your password or app-specific password
          },
      });

      // Define email options
      let mailOptions = {
          from: 'henryjhone10@gmail.com',
          to: userEmail,
          subject: subject,
          html: body,
      };

      // Send the email
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent to user: ' + info.response);
  } catch (error) {
      console.error('Error sending appointment email to user:', error);
      throw error;
  }
}

// Route to accept an appointment by ID
router.put('/accept/:id', async (req, res) => {
  try {
      const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });

      if (!appointment) {
          return res.status(404).send({ error: 'Appointment not found' });
      }

      res.send(appointment);

      // Send email confirmation to the user
      sendAppointmentConfirmationEmailToUser(appointment.email, 'Appointment Accepted', 'Your appointment has been accepted.');
  } catch (error) {
      res.status(400).send(error);
  }
});
  
// Create a new appointment
router.post('/add', async (req, res) => {
  try {
    // Extract appointment details from the request body
    const { expertId, firstName, lastName, email, message, date, time } = req.body;
    
    // Find the expert details based on the expertId
    const expert = await Expertlist.findById(expertId);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    // Create a new appointment object
    const appointment = new Appointment({
      expertId,
      firstName,
      lastName,
      email,
      message,
      date,
      time,
    });

    // Save the appointment to the database
    await appointment.save();

    // Send appointment confirmation email to the expert
    sendAppointmentEmailToExpert(expert.email, expert.name, email, date, time);

    // Send success response
    res.status(201).send(appointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ error: 'Error adding appointment' });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).send();
    }
    res.send(appointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update appointment by ID 
router.put('/update/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'message', 'date', 'time'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!appointment) {
      return res.status(404).send();
    }

    res.send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete appointment by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).send();
    }

    res.send(appointment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
