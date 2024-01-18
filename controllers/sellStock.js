const holdingModel = require('../models/Holding');
const UserModel = require('../models/User');
const Trades = require('../models/Trades')

const sellTheStock = async (req, res) => {

    try {
        const { holdingIdToSell, quantityToSell, time, tradeTypeToExit } = req.body;
        let {sellingPrice}=req.body;
        

        console.log("from api", holdingIdToSell, sellingPrice, quantityToSell, tradeTypeToExit);

        const holding = await holdingModel.findById(holdingIdToSell);
        if (!holding) {
            console.log("Holding not Found!");
            return res.status(404).json({ message: 'Holding not found' });
        }

        

        //Try to fetch Live Price
        const LivePriceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${holding.stock}&token=${process.env.FINNHUB_API_KEY}`);

        if (!LivePriceResponse.ok) 
        {
            return res.status(500).json({
                success: false,
                data: "Internal Server Error",
                message: e.message
            })
        }
        const pureData = await LivePriceResponse.json();

        //Overwritting price with Live Price
        sellingPrice=Number(pureData.c)






        

        const user_id = holding.user_id;
        const user = await UserModel.findById(user_id);
        if (!user) {
            console.log("User Not Found!");
            return res.status(404).json({ message: 'User not found' });
        }

        const { quantity, totalPrice, stock } = holding;
        const avgPrice = totalPrice / quantity;
        const amountToDeductFromTotalPriceOfHolding = avgPrice * quantityToSell;

        //updating holding collection


        holding.quantity -= Number(quantityToSell);
        holding.totalPrice -= Number(amountToDeductFromTotalPriceOfHolding);



        if (holding.quantity == 0) {
            await holdingModel.deleteOne({ _id: holdingIdToSell });
        }
        let TradesHolding = holding.trades;
        TradesHolding.push({ quantity: quantityToSell, price: sellingPrice, tradeTime: time, tradeType: "S" + tradeTypeToExit });



        //Updating the Trades
        const isTradeExists = await Trades.findOne({ user_id: user_id });

        //For adding returns in it
        let returns=0;
        if(tradeTypeToExit=="B")
        {
            returns= (Number(sellingPrice)-Number(avgPrice))/Number(avgPrice) * 100;
        }
        else
        {
            returns= ((Number(avgPrice)-Number(sellingPrice))/Number(avgPrice)) * 100;
        }


        if (isTradeExists != undefined) {
            isTradeExists.allTrades.push({ stock, quantity: quantityToSell, price: sellingPrice, tradeTime: time, tradeType: "S" + tradeTypeToExit,tradeReturn:returns });
            const latestTrades = isTradeExists.allTrades.slice(Math.max(isTradeExists.allTrades.length - 20, 0));
            isTradeExists.allTrades = latestTrades
            await isTradeExists.save();
        }
        else {
            await Trades.create({ user_id, allTrades: [{ stock, quantity: quantityToSell, price: sellingPrice, tradeTime: time, tradeType: "S" + tradeTypeToExit,tradeReturn:returns  }] })
        }




        //Updating user account
        //we will have 2 different cases as per the type of trade to be exited

        if (tradeTypeToExit == "B") {
            const amountToAddToUsersAccount = Number(quantityToSell) * Number(sellingPrice);//always Positive
            console.log("Aatla Aaiva ",amountToAddToUsersAccount,tradeTypeToExit);
            user.currentBalance += Number(amountToAddToUsersAccount);
            await user.save();
            if (holding.quantity != 0)
                await holding.save();
        }
        else if (tradeTypeToExit == "S") {
            const amountToAddToUsersAccount = 2 * (Number(avgPrice) * Number(quantityToSell)) - (Number(sellingPrice) * Number(quantityToSell));
            console.log("Aatla Aaiva ",amountToAddToUsersAccount,tradeTypeToExit);
            user.currentBalance += Number(amountToAddToUsersAccount);
            await user.save();
            if (holding.quantity != 0)
                await holding.save();
        }




        res.status(200).json({
            success: true,
            message: "Stock Exited Successfully"
        })









    }
    catch (e) {
        // Handle errors
        console.error(e + "JImish");
        res.status(500).json({ message: 'Internal Server Error' });

    }


}
module.exports = sellTheStock;