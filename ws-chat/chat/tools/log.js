const winston = require('winston');
const path = require('path');

const ENV = process.env.NODE_ENV;

function getLogger(module) {
    const label = module.filename.split('/').slice(-2).join('/');
    return new winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple(),
                    winston.format.label({ label: label })
                ),
                level: ENV === 'development' ? 'debug' : 'error'
            }),
            new winston.transports.File({
                filename: path.join(__dirname, 'debug.log'),
                level: 'debug'
            })
        ]
    });
}

module.exports = getLogger;