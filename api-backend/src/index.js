import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import logger from "../utils/logger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const allowedOrigins = process.env.ORIGIN.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use(helmet());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy blocked this request.' });
  }
  next(err);
});


import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(__dirname + "/../upload"));
app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("API Octobees is Running");
});

const server = app.listen(PORT, () => logger.info(`Server Running On Port ${PORT}`));
export default server;