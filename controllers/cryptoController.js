async function fetchHistoricalData(currency, date) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${currency}/history?date=${date}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok && !data.error) {
            console.error(`Failed to fetch historical data of ${currency}`);
            return null;
        }
       
        return data;
    } catch (error) {
        console.error(`Error fetching historical data of ${currency}:`, error);
        return null;
    }
}


export async function getExchangeRate(req, res) {
    try {
        const { fromCurrency, toCurrency, date } = req.body;
        
        // Fetch historical market data of the 'fromCurrency' on the specified date
        const fromCurrencyData = await fetchHistoricalData(fromCurrency, date);
        if (!fromCurrencyData) {
            return res.status(400).json({ error: `Failed to get historical data of ${fromCurrency}` });
        }
        if (fromCurrencyData.error) {
            return res.status(400).json({ error: fromCurrencyData.error });
        }
        const toCurrencyData = await fetchHistoricalData(toCurrency, date);
        if (!toCurrencyData) {
            return res.status(400).json({ error: `Failed to get historical data of ${toCurrency}` });
        }
        if (toCurrencyData.error) {
            return res.status(400).json({ error: toCurrencyData.error });
        }
        
        // Calculate the price of 'fromCurrency' in terms of Bitcoin (BTC)
        const fromCurrencyPriceInBTC = fromCurrencyData.market_data.current_price.btc;
        
        // Calculate the price of 'toCurrency' in terms of Bitcoin (BTC)
        const toCurrencyPriceInBTC = toCurrencyData.market_data.current_price.btc;
        
        // Calculate the exchange rate between the two cryptocurrencies
        const exchangeRate = fromCurrencyPriceInBTC / toCurrencyPriceInBTC;
        
        res.json({ 
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            exchangeRate: exchangeRate,
            date: date
        });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function getCompaniesHoldingCrypto(req, res) {
    try {
        const { currency } = req.body;

        if (!currency || (currency !== "bitcoin" && currency !== "ethereum")) {
            return res.status(400).json({ error: "Invalid currency. Possible values are only 'bitcoin' or 'ethereum'." });
        }

        const url = `https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to fetch companies holding ${currency}`);
            return res.status(500).json({ error: `Failed to fetch companies holding ${currency}` });
        }

        const data = await response.json();
        const companiesNames = data.companies.map(company => company.name);
        res.json(companiesNames);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


