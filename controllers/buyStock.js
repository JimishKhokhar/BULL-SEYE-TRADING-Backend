const holdingModel=require('../models/Holding');
const UserModel=require('../models/User');
const Trades=require('../models/Trades');

const buyStock=async (req,res) =>{
    try{
        const {user_id,stock,quantity,price,time}=req.body;
        const amountToPay=price*quantity;
        const user=await UserModel.findOne({_id:user_id});
        console.log(user);
        if(amountToPay>user.currentBalance)
        {
            return res.status(406).json({
                success: true,
                message: "Not Sufficient Balance to Complete Order!"
            })
            
        }

        const isExists=await holdingModel.findOne({user_id:user_id,stock:stock});
        let response;

        console.log("isExists",isExists);
        
        if(isExists)
        {
            console.log(isExists);
            let quantityToAdd=Number(quantity);
            let priceToAdd = Number(price) * Number(quantity);
            
            quantityToAdd+= Number(isExists.quantity);
            priceToAdd+= Number(isExists.totalPrice);

            isExists.quantity=quantityToAdd;
            isExists.totalPrice=priceToAdd;

            let Trades=isExists.trades;
            console.log(Trades)
            Trades.push({quantity:quantity,price:price,tradeTime:time,tradeType:"B"});

            const latestTrades = Trades.slice(Math.max(Trades.length - 5, 0));

            
            isExists.trades=latestTrades;

            await isExists.save();
            response=isExists;
        }
        else
        {
            response= await holdingModel.create({user_id,stock,quantity,totalPrice:Number(price)*Number(quantity) , trades:[{quantity:quantity,price:price,tradeTime:time,tradeType:"B"}]});
        }


        const isTradeExists=await Trades.findOne({user_id:user_id})



        if(isTradeExists!=undefined)
        {
            isTradeExists.allTrades.push({stock,quantity:quantity,price:price,tradeTime:time,tradeType:"B"});
            const latestTrades = isTradeExists.allTrades.slice(Math.max(isTradeExists.allTrades.length - 20, 0));
            isTradeExists.allTrades=latestTrades
            await isTradeExists.save();
        }
        else 
        {
            await Trades.create({user_id,allTrades:[{stock,quantity:quantity,price:price,tradeTime:time,tradeType:"B"}]})
        }


        
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user_id },
            { $inc: { currentBalance: -amountToPay } },
            { new: true }
          );

        console.log(updatedUser);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Stock Purchased Created Successfully"
        })
    }
    catch(e)
    {
        console.log(e)
        return res.status(500).json({
            success:false,
            data:"Internal Server Error",
            message:e.message
        })
    }
}
module.exports=buyStock;