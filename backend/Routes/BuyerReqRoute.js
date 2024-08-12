const express = require("express");
const router = express.Router();
const { upload } = require("../Utills/fileupload");
const BuyerReq = require("../Models/BuyerReqModel");

const {
    addPost,
    getAllPosts,
    getPostDetails,
    getBiddingDetailsByCategory,
    getBiddingsById,
} = require("../Controllers/BuyerReqController");

router.get("/getAllPosts", getAllPosts);
router.post("/createPost", upload.single("image"), addPost);
router.get("/getPost/:id", getPostDetails);
router.get("/category/:category", getBiddingDetailsByCategory);
router.get('/user-biddings/:id', getBiddingsById);


// DELETE delete bidding by ID
router.delete("/delete/:_id", async (req, res) => {
    const _id = req.params._id;
    try {
        const deletedBidding = await BuyerReq.findByIdAndDelete(_id);
        if (!deletedBidding) {
            return res.status(404).json({ error: "Bidding not found" });
        }
        res.json({ status: "Bidding deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting bidding" });
    }
});

// Update bidding by ID 
router.put('/update/:_id', async (req, res) => {
    // const updates = Object.keys(req.body);
    // const allowedUpdates = ['title', 'location', 'category', 'image', 'startingPrice', 'description'];
    // const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    // if (!isValidOperation) {
    //   return res.status(400).send({ error: 'Invalid updates!' });
    // }
  
    try {
    const buyerReq = await BuyerReq.findByIdAndUpdate(req.params._id, req.body, { new: true/*, runValidators: true*/ });
  
      if (!buyerReq) {
        return res.status(404).send();
      }
  
      res.send(buyerReq);

    } catch (error) {
      res.status(400).send(error);
    }
});

module.exports = router;