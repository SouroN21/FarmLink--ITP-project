const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    holdername: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Check if it's a valid email format
                return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    cardNumber: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                // Check if it's a valid credit card number 
                return /^\d{16}$/.test(value);
            },
            message: props => `${props.value} is not a valid credit card number!`
        }
    },
    expiry: {
        type: String,
        validate: {
            validator: function(value) {
                // Check if it's a valid expiry format 
                return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
            },
            message: props => `${props.value} is not a valid expiry date! (Format: MM/YY)`
        }
    },
    cvv: {
        type: Number,
        validate: {
            validator: function(value) {
                // Check if it's a valid CVV 
                return /^\d{3,4}$/.test(value);
            },
            message: props => `${props.value} is not a valid CVV!`
        }
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode: {
        type: Number,
        validate: {
            validator: function(value) {
                // Check if it's a valid ZIP code 
                return /^\d{5}$/.test(value);
            },
            message: props => `${props.value} is not a valid ZIP code!`
        }
    }
});

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;

