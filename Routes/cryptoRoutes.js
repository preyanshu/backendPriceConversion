
import express from "express";
import { updateCryptos } from "../controllers/cryptoUpdater.js";
import { getCompaniesHoldingCrypto } from "../controllers/cryptoController.js";
import { getExchangeRate } from "../controllers/cryptoController.js";

const router = express.Router();

router.get('/cryptoUpdate', (req, res) => updateCryptos(res));
router.post('/getCompanies', getCompaniesHoldingCrypto);
router.post('/getExchangeRate', getExchangeRate);
router.get('/health', (req, res) => res.status(200).json({message:'OK'}) );

export default router;
