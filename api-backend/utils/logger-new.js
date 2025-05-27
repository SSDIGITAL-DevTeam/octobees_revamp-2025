// logger.ts
import fs from 'fs';
import path from 'path';
import pino from 'pino';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// File log stream
const fileStreams = [
  {
    level: 'info',
    stream: fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' }),
  },
  {
    // level: 'error',
    stream: fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' }),
  },
];

// Pretty transport for console (Laravel-style)
const prettyTransport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    levelFirst: true,
    translateTime: 'SYS:standard', // ISO timestamp
    messageFormat: '{levelLabel} [{timestamp}] {msg}', // Laravel-style
    ignore: 'pid,hostname',
  },
});

// Combine with file streams manually
const logger = pino(
  // {
  //   level: 'debug',
  //   timestamp: pino.stdTimeFunctions.isoTime,
  //   formatters: {
  //     level(label) {
  //       return { level: label.toUpperCase() }; // UPPERCASE log level
  //     },
  //   },
  // },
  pino.multistream([
    { stream: prettyTransport },
    ...fileStreams,
  ])
);

export default logger;
