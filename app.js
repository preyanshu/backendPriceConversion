import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from 'cors';
import { job } from './controllers/cryptoUpdater.js';
import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';


dotenv.config();

import connectToDatabase from './db.js';
import cryptoRoutes from './Routes/cryptoRoutes.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// MongoDB Connection
async function startServer() {
    try {
        await connectToDatabase();
        console.log("Database connection established");

        job.start() 


        // Routes
        app.use('/api', cryptoRoutes );


        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); 
    }
}

startServer();
