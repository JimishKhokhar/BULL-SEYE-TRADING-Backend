const mongoose = require('mongoose');

const HoldingSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        stock: {
            type: String,
            required: true,
            maxLength: 50
        },
        quantity: {
            type: mongoose.Types.Decimal128,
            required: true
        },
        totalPrice: {
            type: mongoose.Types.Decimal128,
            required: true
        },
        holdingType:{
            type:String,
            required:true,
            default:"B"
            
        },
        trades: [
            {
                quantity: { type: Number, required: true },
                price: { type:Number, required:true },
                tradeTime: { type: Date, default: Date.now },
                tradeType: { type:String , required:true}                
            }],
    }
)
module.exports = mongoose.model("holding", HoldingSchema);