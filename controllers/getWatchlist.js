const WatchlistModel=require('../models/Watchlist')

const getTheWatchlistController= async (req,res)=>{
    const { user_id } = req.body; // Assuming user_id is in the request parameters

  try {
    // Find the user with the specified user_id
    const user = await WatchlistModel.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the watchlist from the user and send it in the response
    const watchlist = user.stocks;

    res.status(200).json({ watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports=getTheWatchlistController;