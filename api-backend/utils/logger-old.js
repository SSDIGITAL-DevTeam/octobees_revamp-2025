import pino from 'pino';
import pinoMultiStream from 'pino-multi-stream';
import fs from 'fs';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const streams = [
  { stream: process.stdout },
  { stream: fs.createWriteStream('./logs/access.log', { flags: 'a' }) },
  { level: 'error', stream: fs.createWriteStream('./logs/error.log', { flags: 'a' }) }
];

const logger = pino({}, pinoMultiStream.multistream(streams));

export default logger;