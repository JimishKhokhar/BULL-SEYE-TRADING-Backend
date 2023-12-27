const mongoose=require("mongoose");

const UserSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            maxLength:50
        },
        email:{
            type:String,
            required:true,
            maxLength:50
        },
        currentBalance:{
            type:Number,
            required:false,
            default:25000
        },
        createdAt:{
            required:true,
            type:Date,
            default:Date.now()
        },
        netWorth: { type: Number, required: false, default: 25000 },
        sub:{
            type:String,
            required:true,
        }
    }
)

module.exports=mongoose.model("user",UserSchema);