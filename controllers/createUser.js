const UserModel=require('../models/User');

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const response = await UserModel.findOne({email});
        console.log(response)
        if(response)
        {
            console.log("got Response Bhai!");
            res.status(409).json({
                success: true,
                message: "User Already Exist"
            })
            return;
        }
        const response2 = await UserModel.create({ username, email, password });
        res.status(200).json({
            success: true,
            data: response,
            message: "User Created Successfully"
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success:false,
            data:"Internal Server Error",
            message:e.message
        })
    }
}

module.exports=createUser;
