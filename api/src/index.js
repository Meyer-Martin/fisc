import express from 'express';
import dotenv from 'dotenv';
import ip from 'ip';
import cors from 'cors';

import routesServer from './routes/server.routes.js';

import logger from './util/logger.js';
dotenv.config();
const PORT = 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

//Template
app.use('/server', routesServer);

app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));