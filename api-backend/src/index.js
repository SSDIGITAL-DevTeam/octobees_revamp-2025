import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import logger from "../utils/logger.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// cPanel/Passenger di belakang proxy
app.set("trust proxy", 1);

// Body parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/** ===================== CORS ====================== */
const rawOrigin = process.env.ORIGIN || "";
// contoh prod: ORIGIN="https://octobees.com,https://www.octobees.com,https://back-office.octobees.com"
const allowedOrigins = rawOrigin
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// helper: allow *.octobees.com
const allowWildcard = (origin = "") => {
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".octobees.com");
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser/SSR/no-origin requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || allowWildcard(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // kalau pakai cookie auth, aktifkan
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "Content-Type"],
  })
);

// log sederhana per request
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

/** ===================== Security ====================== */
app.use(helmet({
  // Umumnya untuk API tidak butuh CSP ketat; jika perlu, atur manual
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cookieParser());

/** ===================== Static Uploads ====================== */
const __dirname = dirname(fileURLToPath(import.meta.url));
// cek folder yang benar: 'upload' vs 'uploads'
app.use("/uploads", express.static(join(__dirname, "..", "upload")));

/** ===================== Routes ====================== */
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/", (req, res) => res.send("API Octobees is Running"));
app.use("/api", routes);

/** ===================== Error Handling ====================== */
// CORS specific error -> kirim 403
app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy blocked this request." });
  }
  return next(err);
});

// 404 fallback
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ message: "Not Found" });
});

// Global error
app.use((err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

/** ===================== Start ====================== */
const server = app.listen(PORT, () => logger.info(`Server Running On Port ${PORT}`));
export default server;
