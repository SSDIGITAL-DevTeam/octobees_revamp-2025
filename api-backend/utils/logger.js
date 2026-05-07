import pino from "pino";
import fs from "fs";

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
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
  const date = new Date(log.time)
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");
  const levelStr =
    log.level >= 50 ? "ERROR" : log.level >= 40 ? "WARN" : "INFO";
  // return `[${date}] ${levelStr}: ${log.msg}\n`;
  return `[${date}] ${levelStr}: ${log.msg}${log.req ? ` (${log.req.method} ${log.req.url})` : ""}\n`;
};

const destination = fs.createWriteStream("./logs/access.log", { flags: "a" });
const errorDestination = fs.createWriteStream("./logs/error.log", {
  flags: "a",
});

const streams = [
  // { stream: process.stdout },
  {
    stream: {
      write: (data) => {
        const parsed = JSON.parse(data);
        // destination.write(customFormat(parsed));
        const formatted = customFormat(parsed);
        process.stdout.write(formatted); // <-- format ke stdout
        destination.write(formatted); // <-- format ke access.log
      },
    },
  },
  {
    level: "error",
    stream: {
      write: (data) => {
        const parsed = JSON.parse(data);
        const { msg, level, time, pid, hostname, ...extra } = parsed;
        const date = new Date(time).toISOString().replace("T", " ").replace("Z", "");
        const extraStr = Object.keys(extra).length
          ? "\n  " + JSON.stringify(extra, null, 2).replace(/\n/g, "\n  ")
          : "";
        errorDestination.write(`[${date}] ERROR: ${msg}${extraStr}\n`);
      },
    },
  },
];

export const summarizeRequest = (req) => ({
  id: req.id,
  method: req.method,
  url: req.originalUrl || req.url,
  query: req.query && Object.keys(req.query).length ? req.query : undefined,
  params: req.params && Object.keys(req.params).length ? req.params : undefined,
  ip: req.ip,
});

export const summarizeResponse = (req, res, responseTime) => ({
  id: req.id,
  method: req.method,
  url: req.originalUrl || req.url,
  statusCode: res.statusCode,
  durationMs: Number(responseTime?.toFixed?.(1) || responseTime || 0),
});

const logger = pino({ formatters: {} }, pino.multistream(streams));

export default logger;
