import app from "./index";
import ip from 'ip';
import logger from './util/logger';
import dotenv from 'dotenv';

dotenv.config();

const start = (port: number) => {
    try {
        app.listen(port, () => logger.info(`Server running on: ${ip.address()}:${port}`));
    } catch (err) {
        process.exit();
    }
};

start(process.env.PORT_API);