const router = require("express").Router();
const Feedback = require("../Models/feedback");

// Add feedback
router.route("/add").post((req, res) => {
    const { name, email, message, starRating } = req.body;

    const newFeedback = new Feedback({
        name,
        email,
        message,
        starRating
    });

    newFeedback.save()
        .then(() => {
            res.json("Feedback Added");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while adding feedback" });
        });
});

// Get all feedback
router.route("/").get((req, res) => {
    Feedback.find()
        .then((feedbacks) => {
            res.json(feedbacks);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching feedback" });
        });
});

// Update feedback
router.put('/accept/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });

        if (!feedback) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send(feedback);

        
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.route("/update/:id").put(async (req, res) => {
    const { name, email, message, starRating } = req.body;
    const userId = req.params.id;

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(userId, { name, email, message, starRating }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.json({ status: "Feedback updated", updatedFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while updating feedback" });
    }
});

// Delete feedback
router.route("/delete/:id").delete(async (req, res) => {
    const userId = req.params.id;

    try {
        await Feedback.findByIdAndDelete(userId);
        res.json({ status: "Feedback deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting feedback" });
    }
});

// Get feedback by ID
router.route("/get/:id").get(async (req, res) => {
    const userId = req.params.id;

    try {
        const feedback = await Feedback.findById(userId);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.json({ status: "Feedback fetched", feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching feedback" });
    }
});



// Get accepted feedbacks
router.route("/accepted").get(async (req, res) => {
    try {
        const acceptedFeedbacks = await Feedback.find({ status: 'Accepted' });
        res.json(acceptedFeedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching accepted feedbacks" });
    }
});
// Add reply to feedback
router.post("/feedback/reply/:id", async (req, res) => {
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
// Add like to feedback
router.put('/like/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });

        if (!feedback) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send(feedback);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add dislike to feedback
router.put('/dislike/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });

        if (!feedback) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send(feedback);
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;


module.exports = router;