const getTopStocks = async (req, res) => {
    try {
        const { stocks } = req.body; // Array of stock symbols like ['AAPL', 'MSFT', 'NVDA', ...]

        const fetchStockQuote = async (symbol) => {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch quote for ${symbol}`);
            }

            const data = await response.json();
            return {
                name: symbol,
                price: `$${data.c.toFixed(2)}`, // Current price
                change: (data.d >= 0 ? `+${data.d.toFixed(2)}` : `${data.d.toFixed(2)}`), // Change in price
            };
        };

        // Fetch quotes for all stocks in parallel
        const stockQuotes = await Promise.all(stocks.map(stock => fetchStockQuote(stock)));

        return res.status(200).json(stockQuotes);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}

module.exports = getTopStocks