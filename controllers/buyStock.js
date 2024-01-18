const holdingModel = require('../models/Holding');
const UserModel = require('../models/User');
const Trades = require('../models/Trades');

const buyStock = async (req, res) => {

    try {

        console.log("\n \n Hello")

        const { user_id, stock, quantity, time, type } = req.body;// price is also got but not use of price got from request
        let {price}=req.body;

        //Try to fetch Live Price
        const LivePriceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${process.env.FINNHUB_API_KEY}`);

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
        price=Number(pureData.c)
        



        const amountToPay = price * quantity;
        const user = await UserModel.findOne({ _id: user_id });
        // console.log(user);
        if (amountToPay > user.currentBalance) {
            return res.status(406).json({
                success: true,
                message: "Not Sufficient Balance to Complete Order!"
            })

        }

        const isExists = await holdingModel.findOne({ user_id: user_id, stock: stock, holdingType: type });

        let response;


        if (isExists) {
            console.log(isExists);
            let quantityToAdd = Number(quantity);
            let priceToAdd = Number(price) * Number(quantity);

            quantityToAdd += Number(isExists.quantity);
            priceToAdd += Number(isExists.totalPrice);

            isExists.quantity = quantityToAdd;
            isExists.totalPrice = priceToAdd;

            let Trades = isExists.trades;
            console.log(Trades)
            Trades.push({ quantity: quantity, price: price, tradeTime: time, tradeType: "B" + type });

            const latestTrades = Trades.slice(Math.max(Trades.length - 5, 0));


            isExists.trades = latestTrades;

            await isExists.save();
            response = isExists;
        }
        else {
            response = await holdingModel.create({ user_id, stock, quantity, totalPrice: Number(price) * Number(quantity), holdingType: type, trades: [{ quantity: quantity, price: price, tradeTime: time, tradeType: "B" + type }] });
        }


        const isTradeExists = await Trades.findOne({ user_id: user_id })



        if (isTradeExists != undefined) {
            isTradeExists.allTrades.push({ stock, quantity: quantity, price: price, tradeTime: time, tradeType: "B" + type });
            const latestTrades = isTradeExists.allTrades.slice(Math.max(isTradeExists.allTrades.length - 20, 0));
            isTradeExists.allTrades = latestTrades
            await isTradeExists.save();
        }
        else {
            await Trades.create({ user_id, allTrades: [{ stock, quantity: quantity, price: price, tradeTime: time, tradeType: "B" + type }] })
        }




        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user_id },
            { $inc: { currentBalance: -amountToPay } },
            { new: true }
        );

        // console.log(updatedUser);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Stock Purchased Created Successfully"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: e.message
        })
    }
}
module.exports = buyStock;