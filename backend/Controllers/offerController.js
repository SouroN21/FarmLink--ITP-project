const Offer = require("../Models/offersModel");

// Controller functions for handling CRUD operations
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOffer = async (req, res) => {
  const { products, coupon, discount, startDate, endDate } = req.body;

  try {
    // Check for existing offers that overlap the date range and include any of the specified products
    const existingOffers = await Offer.find({
      products: { $in: products },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingOffers.length > 0) {
      // Generate a message listing all conflicting products
      const conflictingProducts = existingOffers.flatMap(offer => offer.products.map(product => product.toString()));
      const uniqueConflictingProducts = [...new Set(conflictingProducts)];
      return res.status(406).json({ message: "Some products are already part of an existing offer in the given date range", conflictingProducts: uniqueConflictingProducts ,status:406});
    }

    // If no conflicts, create the new offer
    const offer = new Offer({
      products,
      coupon,
      discount,
      startDate,
      endDate,
    });
    const newOffer = await offer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.products = req.body.products;
    offer.coupon = req.body.coupon;
    offer.discount = req.body.discount;
    offer.startDate = req.body.startDate;
    offer.endDate = req.body.endDate;

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOffersByDate = async (req, res) => {
  try {

    console.log(req.query.startDate)
    // Parse start date and end date from query parameters
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    // Query offers within the specified date range
    const offers = await Offer.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });

    // Return offers as response
    res.json(offers);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};