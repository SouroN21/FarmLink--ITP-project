const express = require('express');
const router = express.Router();
const biddingController = require('../Controllers/biddingController');

// router.post('/', biddingController.createBidding);
// Other routes like PUT, DELETE, GET, etc.

// Update bidding by ID 
router.post('/post', async (req, res) => {
    console.log("Req", req.body);
    try {
    const biddingRes = await biddingController.createBidding(req, res, { new: true/*, runValidators: true*/ });
  
      if (!biddingRes) {
        return res.status(404).send();
      }
  
      res.status(200).send(biddingRes);

    } catch (error) {
      res.status(400).send(error);
    }
});

// Define a route to fetch bids placed by the user
router.get('/bids/:userId', async (req, res) => {
  try {
   

    // Query the database to find bids placed by the user
    // const bids = await biddingController.find({ biddingProductID: new mongoose.Types.ObjectId(element._id) }).sort({sellingPrice : -1});
    const userBids = await biddingController.getBidsByUserID(req, res)
    // if (!userBids) {
    //   return res.status(404).send();
    // }

     res.status(200).send(userBids);
     return;
  } catch (error) {
    console.error('Error fetching bids:', error);
    // res.status(500).json({ error: 'Server error' });
    return;
  }
});


module.exports = router;
