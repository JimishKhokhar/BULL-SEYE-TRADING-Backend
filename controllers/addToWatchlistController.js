const WatchlistModel=require('../models/Watchlist')

const addToWatchlist= async (req,res)=>{
  const { user_id, stockName, stockSymbol } = req.body;
  
    try {
      // Check if the user exists
      let user = await WatchlistModel.findOne({ user_id });
  
      if (!user) {
        // If the user doesn't exist, create a new document
        user = new WatchlistModel({ user_id, stocks: [] });
      }

      
    // Check if the stock is already in the array
    const isStockPresent = user.stocks.some(
      (stock) => stock.stockSymbol === stockSymbol
    );

    if (isStockPresent) {
      return res.status(400).json({
        message: 'Stock already exists in the watchlist',
      });
    }

    // Check if the array size doesn't exceed 10
    if (user.stocks.length >= 20) {
      return res.status(401).json({
        message: 'Watchlist is full. Cannot add more stocks',
      });
    }

  
      // Add the stock to the stocks array
      user.stocks.push({ stockName, stockSymbol });
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Stock added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports=addToWatchlist;