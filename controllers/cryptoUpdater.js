import { CronJob } from 'cron';
import Crypto from '../Models/Crypto.js';

export async function updateCryptos(res) {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        if (!response.ok) {
            console.error('Failed to fetch cryptocurrency data');
            if (res) {
                res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
            }
            return; 
        }
        const cryptos = await response.json();
        await Crypto.deleteMany({}); 
        await Crypto.insertMany(cryptos);
        console.log('Cryptocurrencies updated successfully.');
        if (res) {
            res.json({ success: true, message: 'Cryptocurrencies updated successfully.' });
        }
        
    } catch (error) {
        console.error('Error updating cryptocurrencies:', error);
        if (res) {
            res.status(500).json({ error: 'Error updating cryptocurrencies' });
        }
    }
}


export const job = new CronJob('0 * * * *', () => updateCryptos()); 
