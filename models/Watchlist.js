const mongoose = require('mongoose');

const Watchlist = new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
      unique: true
    },
    stocks: [
      {
        stockName: {
          type: String,
          required: true
        },
        stockSymbol: {
          type: String,
          required: true
        }
      }
    ]
  });

  const WatchlistModel = mongoose.model('Watchlist', Watchlist);

module.exports = WatchlistModel;