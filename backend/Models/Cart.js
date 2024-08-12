const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            productName: String,
            productPrice: Number,
            imageUrl: String, // URL of the product image
            quantity: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                default: 0 
            }
        }
    ],
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        default: 'Pending' // Status can be 'Pending', 'Paid', 'Failed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);