const UserModel = require('../models/User');
const Trades=require('../models/Trades');

const getAllTradesFunc= async (req,res)=>{

    try {
        const id = req.body?.user_id;
        const response=await Trades.find({user_id:id});
        
    
        
        res.status(200).json({
            success: true,
            data: response,
            message: "Sent All Trades"
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: e.message
        })
    }

}
module.exports=getAllTradesFunc;