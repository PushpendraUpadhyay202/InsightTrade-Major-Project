const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    // Virtual money for the simulation
    balance: {
        type: Number,
        default: 100000, // Starting cash: ₹1,00,000
    },
    // Array to keep track of what they actually own
    portfolio: [
        {
            stockName: String,
            qty: Number,
            avgPrice: Number,
        }
    ]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;