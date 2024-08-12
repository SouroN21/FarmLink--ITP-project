const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchasedItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageURL: {
            type: String,
            required: false
        },
        quantity: {
            type: Number,
            default: 1 
        },
        amount: {
            type: Number,
            default: 0 
        }
    }],
    discountApplied: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped'],
        default: 'Pending'
    },
    orderDate: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', orderSchema);
