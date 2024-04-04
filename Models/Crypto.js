import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
    id: String,
    symbol: String,
    name:String
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

export default Crypto;
