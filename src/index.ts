import app from './app';
import logger from './utils/logger';

const { PORT = 3000 } = process.env;

app.listen(PORT, () => logger.info(`PYG Server listening on PORT: ${PORT}`));
