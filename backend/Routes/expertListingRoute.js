const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../Utills/fileupload');
const Expertlist = require('../Models/expertListingModel');

// POST endpoint for adding expert farmer details with picture upload
router.post('/add', upload.single('picture'), async (req, res) => {
    try {
        const { name, email, location } = req.body;
        const expertise = req.body.expertise.split(',').map(str => str.trim()); // Convert expertise to an array of strings

        const picture = req.file ? req.file.filename : '';

        const newExpert = new Expertlist({
            name,
            email,
            expertise,
            location,
            picture,
        });

        await newExpert.save();
        res.status(201).json(newExpert);
    } catch (error) {
        console.error('Error adding expert farmer:', error);
        res.status(500).json({ error: 'Error adding expert farmer' });
    }
});

// GET endpoint to fetch all expert farmers
router.get('/', async (req, res) => {
    try {
        const experts = await Expertlist.find();
        res.json(experts);
    } catch (error) {
        console.error('Error fetching expert farmers:', error);
        res.status(500).json({ error: 'Error fetching expert farmers' });
    }
});

// GET endpoint to fetch a single expert farmer by ID
router.get('/:id', async (req, res) => {
    try {
        const expert = await Expertlist.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({ error: 'Expert farmer not found' });
        }
        res.json(expert);
    } catch (error) {
        console.error('Error fetching expert farmer:', error);
        res.status(500).json({ error: 'Error fetching expert farmer' });
    }
});

// PUT endpoint to update expert farmer details
router.put('/update/:id', upload.single('picture'), async (req, res) => {
    try {
        const { name, email, expertise, location } = req.body;
        const picture = req.file ? req.file.filename : '';

        const updatedExpert = {
            name,
            email,
            expertise,
            location,
            picture,
        };

        const expert = await Expertlist.findByIdAndUpdate(req.params.id, updatedExpert, { new: true });
        if (!expert) {
            return res.status(404).json({ error: 'Expert farmer not found' });
        }
        res.json(expert);
    } catch (error) {
        console.error('Error updating expert farmer:', error);
        res.status(500).json({ error: 'Error updating expert farmer' });
    }
});

// DELETE endpoint to delete an expert farmer by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const expert = await Expertlist.findByIdAndDelete(req.params.id);
        if (!expert) {
            return res.status(404).json({ error: 'Expert farmer not found' });
        }
        res.json({ message: 'Expert farmer deleted successfully' });
    } catch (error) {
        console.error('Error deleting expert farmer:', error);
        res.status(500).json({ error: 'Error deleting expert farmer' });
    }
});

module.exports = router;
