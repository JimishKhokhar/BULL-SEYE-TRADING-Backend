const WatchlistModel=require('../models/Watchlist')

const deleteWatchlistController = async (req, res) => {
    const { user_id, stockSymbol } = req.body;
  
    try {
      // Check if the user exists
      const list = await WatchlistModel.findOne({ user_id });
  
      if (!list) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
  
      // Check if the stock is in the watchlist
      const stockIndex = list.stocks.findIndex(
        (stock) => stock.stockSymbol === stockSymbol
      );
  
      if (stockIndex === -1) {
        return res.status(405).json({
          message: 'Stock not found in the watchlist',
        });
      }
  
      // Remove the stock from the array
      list.stocks.splice(stockIndex, 1);
  
      // Save the updated user document
      await list.save();
  
      res.status(200).json({ message: 'Stock removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  module.exports = deleteWatchlistController;
  