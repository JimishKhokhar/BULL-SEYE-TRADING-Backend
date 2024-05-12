const getPeers= async(req,res)=>{

    try {
        const { stock } = req.body;
        // const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${process.env.FINNHUB_API_KEY}`);
        const response = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${stock}&token=${process.env.FINNHUB_API_KEY}`);
        if (!response.ok) {
            return res.status(500).json({
                success:false
            });
        }

        const pureData = await response.json();

        return res.status(200).json(pureData)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: e.message
        })
    }

}
module.exports=getPeers