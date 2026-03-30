const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mode: {
    type: String, 
    enum: ['BUY', 'SELL'], // Restricts the input to only these two options
    required: true,
  },
  // Link this order to a specific user
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = { OrdersSchema };