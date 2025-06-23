import pino from 'pino';
import fs from 'fs';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// const customFormat = (log) => {
//   const { msg, level, time, ...rest } = log;
//   return JSON.stringify({
//     msg,
//     level,
//     time,
//     ...rest
//   }) + '\n';
// };

const customFormat = (log) => {
  const date = new Date(log.time).toISOString().replace('T', ' ').replace('Z', '');
  const levelStr = log.level >= 50 ? 'ERROR' : log.level >= 40 ? 'WARN' : 'INFO';
  // return `[${date}] ${levelStr}: ${log.msg}\n`;
  return `[${date}] ${levelStr}: ${log.msg}${log.req ? ` (${log.req.method} ${log.req.url})` : ''}\n`;
};


const destination = fs.createWriteStream('./logs/access.log', { flags: 'a' });
const errorDestination = fs.createWriteStream('./logs/error.log', { flags: 'a' });

const streams = [
  // { stream: process.stdout },
  {
    stream: {
      write: (data) => {
        const parsed = JSON.parse(data);
        // destination.write(customFormat(parsed));
        const formatted = customFormat(parsed);
        process.stdout.write(formatted); // <-- format ke stdout
        destination.write(formatted);    // <-- format ke access.log
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
