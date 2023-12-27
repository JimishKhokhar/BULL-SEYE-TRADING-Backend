const UserModel=require('../models/User');

const getTopTenController=async (req, res) => {
    try {
      const topUsers = await UserModel.find({}).select("username netWorth")
        .sort({ netWorth: -1 }) // Sorting in descending order based on currentBalance
        .limit(10); // Limiting the result to the top 10 users

        const reducedTopUsers = topUsers.map(({ username, netWorth }) => ({ username, netWorth }));
    
  
      res.status(200).json(reducedTopUsers);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}    

module.exports=getTopTenController;