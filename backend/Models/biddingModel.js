const { types } = require('joi');
const mongoose = require('mongoose');

const biddingSchema = new mongoose.Schema({
    userID: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "profilemanagement",
    },
    sellingPrice: {
        type: Number,
        required: true
    },
 
    createdAt: {
        type: Date,
        default: Date.now
    },
    biddingProductID: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Bidding",
    }
});

module.exports = mongoose.model('BiddingData', biddingSchema);
