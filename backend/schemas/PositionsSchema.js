const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  user: { type: String, required: true }, // 👈 Added this!
  product: String,
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

module.exports = { PositionsSchema };