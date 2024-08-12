const BuyerReqModel = require('../Models/BuyerReqModel');
const Bidding = require('../Models/biddingModel');
require("dotenv").config();
const mongoose = require("mongoose");


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    });



exports.findAndUpdateBiddingExp = async (req, res) => {
    const buyerRequestList = await BuyerReqModel.find({ isProductSold: false });
    console.log("buyerRequestList", buyerRequestList.length);


    const timeNow = new Date();
    
    let expBiddingsList = [];

    for (let index = 0; index < buyerRequestList.length; index++) {
        const element = buyerRequestList[index];
        const endTime = new Date(element.biddingEndTime);

        if (timeNow >= endTime) {
            expBiddingsList.push(element)
        }
    }

   

    for (let i=0; i<expBiddingsList.length; i++) {
        const element= expBiddingsList[i];
        // console.log(element);
        console.log(new mongoose.Types.ObjectId(element._id));
        const higherBid = await Bidding.findOne({ biddingProductID: new mongoose.Types.ObjectId(element._id) }).sort({sellingPrice : -1});
        if(higherBid){
            let update = await BuyerReqModel.updateOne({_id : new mongoose.Types.ObjectId(element._id)}, {$set : {isProductSold : true, soldToUser : higherBid.userID, soldPrice : higherBid.sellingPrice}})
           
            console.log("If Update : ", update);
        }else{
            let update = await BuyerReqModel.updateOne({_id : new mongoose.Types.ObjectId(element._id)}, {$set : {isProductSold : true}})
            console.log("Else Update : ", update);
            
        }
        console.log("---------------------------");
    }




    // let arr =[];

    // for (let i=0; i< buyerRequestList.length ; i++){

    //     arr.push(buyerRequestList[i]);

    //     let currentTimeStamp= 
    // }


    // try {
    //     console.log("Bidding Data  : ",req.body);
    //     const { userID, sellingPrice, biddingProductID } = req.body;

    //     const bidding = new Bidding({
    //         userID,
    //         sellingPrice,
    //         biddingProductID
    //     });
    //     const savedBidding = await bidding.save();
    //     res.status(201).json(savedBidding);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
    console.log("Working Cron Function");
};