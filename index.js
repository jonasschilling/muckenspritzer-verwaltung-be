const http = require ('http');
const { config } = require ('dotenv');
const app = require ('./app.js');
const logger = require ('./utils/logger.js');

if (process.env.NODE_ENV !== "production") {
    config();
}

const server = http.createServer(app);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});