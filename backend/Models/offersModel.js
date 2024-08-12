const mongoose = require("mongoose");
const { Schema } = mongoose;

const offerSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  coupon: {
    type: String,
    default: null,
  },
  discount: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
