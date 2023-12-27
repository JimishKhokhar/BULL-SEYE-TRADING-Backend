const holdingModel = require('../models/Holding');
const UserModel = require('../models/User');
const Trades = require('../models/Trades')

const sellTheStock = async (req, res) => {

    try {
        const { holdingIdToSell,sellingPrice,quantityToSell,time } = req.body;

        console.log("from api",holdingIdToSell,sellingPrice,quantityToSell);
        // throw error(2);
        

        // res.status(200).json({ message: 'Stock sold successfully Khote Khote!' });




        

        const holding = await holdingModel.findById(holdingIdToSell);
        if (!holding) {
            console.log("Holding not Found!");
            return res.status(404).json({ message: 'Holding not found' });
        }
        
        const user_id=holding.user_id;
        const user = await UserModel.findById(user_id);
        if (!user) {
            console.log("User Not Found!");
            return res.status(404).json({ message: 'User not found' });
        }

        const {quantity,totalPrice,stock} = holding;
        const avgPrice=totalPrice/quantity;
        const amountToDeductFromTotalPriceOfHolding=avgPrice*quantityToSell;

        //updating holding collection
        

        holding.quantity -= Number(quantityToSell);
        holding.totalPrice -= Number(amountToDeductFromTotalPriceOfHolding);

        

        if(holding.quantity==0)
        {
            await holdingModel.deleteOne({ _id: holdingIdToSell });
        }
        let TradesHolding=holding.trades;
        TradesHolding.push({quantity:quantityToSell,price:sellingPrice,tradeTime:time,tradeType:"S"});



        //Updating the Trades
        const isTradeExists=await Trades.findOne({user_id:user_id});


        if(isTradeExists!=undefined)
        {
            isTradeExists.allTrades.push({stock,quantity:quantityToSell,price:sellingPrice,tradeTime:time,tradeType:"S"});
            const latestTrades = isTradeExists.allTrades.slice(Math.max(isTradeExists.allTrades.length - 20, 0));
            isTradeExists.allTrades=latestTrades
            await isTradeExists.save();
        }
        else 
        {
            await Trades.create({user_id,allTrades:[{stock,quantity:quantityToSell,price:sellingPrice,tradeTime:time,tradeType:"S"}]})
        }



        
        //Updating user account

        const amountToAddToUsersAccount = Number(quantityToSell)*Number(sellingPrice);//always Positive
        
        user.currentBalance += Number(amountToAddToUsersAccount);
        await user.save();
        if(holding.quantity!=0)
        await holding.save();


        res.status(200).json({
            success: true,
            message: "Stock Sold Successfully"
        })

        
        
        
        
        

       

    }
    catch (e) {
        // Handle errors
        console.error(e+"JImish");
        res.status(500).json({ message: 'Internal Server Error' });

    }


}
module.exports=sellTheStock;