import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import routes from "./routes.js";
import logger, {
  summarizeRequest,
  summarizeResponse,
} from "../utils/logger.js";
import { startBatchScheduler } from "./scheduler/batch-scheduler.js";
import { seedCommissionRules } from "./partner/commission-rule.seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const defaultLocalOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3006",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = new Set([
  ...defaultLocalOrigins,
  ...(process.env.ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
]);

const allowWildcard = (origin = "") => {
  try {
    const url = new URL(origin);
    return (
      url.hostname.endsWith(".octobees.com") ||
      url.hostname.endsWith(".digital-pa.com.sg")
    );
  } catch {
    return false;
  }
};

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedOrigins.has(normalizedOrigin) || allowWildcard(normalizedOrigin)) {
      return callback(null, true);
    }

    logger.warn({ origin }, "CORS blocked: origin not in allowlist");
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    quietResLogger: true,
    serializers: {
      req: summarizeRequest,
      res: (res) => ({ statusCode: res.statusCode }),
      err: (err) => ({
        type: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      }),
    },
    customReceivedMessage: (req) =>
      `-> ${req.method} ${req.originalUrl || req.url}`,
    customSuccessMessage: (req, res) =>
      `<- ${res.statusCode} ${req.method} ${req.originalUrl || req.url}`,
    customErrorMessage: (req, res, err) =>
      `<- ${res.statusCode} ${req.method} ${req.originalUrl || req.url} ERROR: ${err.message}`,
    customReceivedObject: (req) => summarizeRequest(req),
    customSuccessObject: (req, res, object) => ({
      ...object,
      ...summarizeResponse(req, res, object.responseTime),
    }),
    customErrorObject: (req, res, err, object) => ({
      ...object,
      ...summarizeResponse(req, res, object.responseTime),
      error: {
        type: err.name,
        message: err.message,
      },
    }),
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "upload"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      }
    },
  }),
);

app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/", (req, res) => res.send("API Octobees is Running"));
app.use("/api", routes);

app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy blocked this request." });
  }
  return next(err);
});

app.use((req, res, next) => {
  if (res.headersSent) {
    return next();
  }

  return res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  return res.status(status).json({ message: err.message || "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  logger.info(`Server Running On Port ${PORT}`);
  startBatchScheduler();
  seedCommissionRules()
    .then((result) => {
      if (result.created > 0) {
        logger.info(`[commission-rules] Seeded ${result.created} default rule(s).`);
      }
    })
    .catch((err) => logger.error("[commission-rules] Seed failed:", err));
});

const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

export default server;
