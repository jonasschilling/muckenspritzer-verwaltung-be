const http = require('http');
const { config } = require('dotenv');
const app = require('./app.js');
const logger = require('./utils/logger.js');

if (process.env.NODE_ENV !== "production") {
    config();
}

const server = http.createServer(app);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    getIPForDev();
});


function getIPForDev() {

    const options = {
        hostname: 'api.ipify.org',
        port: 80,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            logger.info('IP-Adresse der Anwendung:', data);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.end();
}