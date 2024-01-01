const holdingModel = require('../models/Holding');
const UserModel = require('../models/User');


const cronjob = async (req, res) => {
    try {
        const uniqueStocks = await holdingModel.distinct('stock');
        let isMarketLive = -1;
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${process.env.FINNHUB_API_KEY}`)
        if (response.status == 200) {
            const pureData = await response.json();
            if (pureData.isOpen)
                isMarketLive = 1
            else isMarketLive = 0;
        }
        if (isMarketLive != 1) {
            res.status(200).json({
                success: false,
                data: "MARKET IS NOT LIVE",
                message: "MARKET IS NOT LIVE"
            })
            return;
        }

        let livePrices = {};
        for(stock of uniqueStocks)
        {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${process.env.FINNHUB_API_KEY}`);
            if (!response.ok) {
                livePrices[stock]=-1;
                continue;
            }
            const pureData = await response.json();
            livePrices[stock]=Number(pureData?.c);

            await new Promise(resolve => setTimeout(resolve, 2000));

        }
        

  

        //we got the live prices of all the stocks
        const users = await UserModel.find({});


        for (let user of users) {
            const holdings = await holdingModel.find({ user_id: user._id });

            let currentBalance = Number(user.currentBalance);


            let worth = 0;
            for (let holding of holdings) {
                let holdingStock = holding.stock;
                let holdingQuantity = Number(holding.quantity);
                let totalPrice = Number(holding.totalPrice);

                if (holdingStock in livePrices) {
                    let newprice = Number(livePrices[holdingStock]);
                    worth += Number(holdingQuantity * newprice);
                }
                else {
                    worth += Number(totalPrice);
                }
            }
            worth += Number(currentBalance);
            let netWorth=Number(worth);


            let newUser=await UserModel.findByIdAndUpdate(user._id, { $set: { netWorth } }, { new: true });
            
        }




        res.status(200).json({ message:"Net-Worth Updated successfully" });
        return;

    }
    catch (e) {
        res.status(500).json({
            success: false,
            data: "CRON JOB FAILED",
            message: e.message
        })
    }
}
module.exports = cronjob;
