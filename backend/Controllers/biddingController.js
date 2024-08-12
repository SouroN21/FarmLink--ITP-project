const Bidding = require('../Models/biddingModel');
const BuyerReqModel = require('../Models/BuyerReqModel');

exports.createBidding = async (req, res) => {
    try {
        console.log("Bidding Data  : ", req.body);
        const { userID, sellingPrice, biddingProductID } = req.body;
        const bidding = new Bidding({
            userID,
            sellingPrice,
            biddingProductID
        });
        const savedBidding = await bidding.save();
        res.status(201).json(savedBidding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to fetch bids placed by a user
exports.getBidsByUserID = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("USER ID ", userId);
        // Fetch bids placed by the user from the database
        const userBids = await BuyerReqModel.find({ soldToUser: userId }); // Assuming Bid is the model representing bids

        res.status(200).json(userBids);
        return;
    } catch (err) {
        console.error('Error fetching user bids:', err);
        res.status(500).json({ error: 'Server error' });
        return;
    }
};


// Other controller methods like update, delete, get all, etc.
