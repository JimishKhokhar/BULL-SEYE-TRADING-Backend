const UserModel=require('../models/user');

//returns whole user Object 
const findTheBalance=async (req,res)=>{
    try{
        const { user_id } = req.body;
        const user=await UserModel.find({_id:user_id});
        
        res.status(200).json({
            success:true,
            data:user,
            message:"Found"
        })

    }
    catch(err)
    {
        console.log(err);
        console.error(err);
        res.status(500)
        .json({
            success:false,
            error:err.message,
            message:"Server Error"
        })
    }
}

module.exports=findTheBalance;