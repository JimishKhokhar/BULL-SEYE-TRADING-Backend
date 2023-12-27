const mongoose = require('mongoose');

// Define the schema
const tradesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  allTrades: [
    {
        stock: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type:Number, required:true },
        tradeTime: { type: Date, default: Date.now },
        tradeType: { type:String , required:true}                
    }]
});

// Create the Trades model
const Trades = mongoose.model('Trades', tradesSchema);

module.exports = Trades;