import pino from 'pino';
import fs from 'fs';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Custom formatter (msg duluan)
const customFormat = (log) => {
  const { msg, level, time, ...rest } = log;
  return JSON.stringify({
    msg,
    level,
    time,
    ...rest
  }) + '\n';
};

const destination = fs.createWriteStream('./logs/access.log', { flags: 'a' });
const errorDestination = fs.createWriteStream('./logs/error.log', { flags: 'a' });

const streams = [
  { stream: process.stdout },
  {
    stream: {
      write: (data) => {
        const parsed = JSON.parse(data);
        destination.write(customFormat(parsed));
      }
    }
  },
  {
    level: 'error',
    stream: {
      write: (data) => {
        const parsed = JSON.parse(data);
        errorDestination.write(customFormat(parsed));
      }
    }
  }
];

const logger = pino({ formatters: {} }, pino.multistream(streams));

export default logger;
