const getMarketStatus=async(req,res)=>{
    try{
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${process.env.FINNHUB_API_KEY}`)
        
        let marketStatus=-1
        if (response.status == 200) {
            const pureData = await response.json();
            if (pureData.isOpen)
               marketStatus=1;
            else marketStatus=0;
        }
        return res.status(200).json({marketStatus})
    }catch(e)
    {
        return res.status(200).json({marketStatus:-1})
    }
}
module.exports=getMarketStatus