import express from 'express';
import cors from 'cors';

import routesServer from './routes/server.routes';
import routesUser from './routes/user.routes';


const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/user', routesUser)
app.use('/server', routesServer);

export default app;