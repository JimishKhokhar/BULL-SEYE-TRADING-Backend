const UserModel=require('../models/user');

const findUser=async (req,res)=>{
    try{
        const { username,email,sub } = req.body;
        const userResponse=await UserModel.findOne({sub:sub});

        console.log("User Respionse FROM API",userResponse)
        
        if(userResponse)
        {
            res.status(200).json({
                success:true,
                data:userResponse,
                message:"Found"
            })
            return;
        }

        const newUser = await UserModel.create({ username, email, sub });
        res.status(200).json({
            success:true,
            data:newUser,
            message:"New User Created!"
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

module.exports=findUser;