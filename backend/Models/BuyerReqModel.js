const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BiddingPostSchema = new Schema({
    description:{
        //dataType
        type:String,
        //validation
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type : Object,
        required : [false,"Please add an image"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "profilemanagement",
    },
    title:{
        type:String,
        required:true,
    },
    startingPrice:{
        type:Number,
        required:true,
    },
    sellingPrice:{
        type:Number,
        required:false,
    },
    biddingEndTime:{
        type:Date,
        required:true,
    },
    bidWinner:{
        type:mongoose.Schema.Types.ObjectId,
        required : false,
        ref: "profilemanagement",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isProductSold : {
        type : Boolean,
        require : false,
        default : false
    },
    soldToUser:{
        type:mongoose.Schema.Types.ObjectId,
        required : false,
        ref: "profilemanagement",
    },
    soldPrice:{
        type:Number,
        required:false,
    },
});

const BiddingData = mongoose.model('Bidding', BiddingPostSchema);

module.exports=BiddingData;