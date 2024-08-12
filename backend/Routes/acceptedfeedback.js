// feedback.js - Backend route to handle adding a reply to a feedback
const router = require("express").Router();
const Feedback = require("../Models/feedback");

// Add reply to feedback
router.post("/reply/:id", async (req, res) => {
    const { id } = req.params;
    const { replyText } = req.body;

    try {
        // Find the feedback by ID
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        // Add the reply to the feedback
        feedback.reply = replyText;

        // Save the updated feedback
        await feedback.save();

        // Respond with success message
        res.status(200).json({ message: 'Reply added successfully', feedback });
    } catch (error) {
        console.error('Error adding reply to feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
