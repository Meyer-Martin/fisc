import express from 'express';
import dotenv from 'dotenv';
import ip from 'ip';
import cors from 'cors';

import routesTemplate from './routes/template.routes.js';

import logger from './util/logger.js';
dotenv.config();
const PORT = 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

//Template
app.use('/template', routesTemplate);

app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));