
const express = require("express");
const router = express.Router();
const offerController = require("../Controllers/offerController");
 
// Routes for CRUD operations
router.get("/", offerController.getAllOffers);
router.get("/byDate", offerController.getOffersByDate);
router.get("/:id", offerController.getOfferById);
router.post("/", offerController.createOffer);
router.put("/:id", offerController.updateOffer);
router.delete("/:id", offerController.deleteOffer);
 
module.exports = router;  
 
