import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import logger from "../utils/logger.js";
// import http from 'http'
// import rateLimit from 'express-rate-limit'

//new
// import ServiceCatController from "./service-category/service-category.controller.js";
// import RoleController from "./role/role.controller.js";
// import ServicePlanController from "./service-plan/service-plan.route.js";
// import OrderController from "./order/order.controller.js";
// import MetaController from "./meta/meta.controller.js";
// import PageController from "./pages/pages.controller.js";
// import OrderController from "./order/order.controller.js";
// import BlogController from "./blog/blog.controller.js";
// import BlogCategoryController from "./blog-category/blog-category.controller.js";

// //authentications
// import loginController from "./auth/login/login.controller.js";
// import refreshToken from "./auth/refresh-token/refresh.controller.js";
// import logoutController from "./auth/logout/logout.controller.js";

// middlewares
// import verifyToken from "./middleware/verify.token.js";
// import { upload } from "./middleware/uploadImage.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
//const PORT =  8080;

app.use(express.json());
//socket
// import handleSocket from './socket/websocket.js'
// const server = http.createServer(app)
//Rate Limiter
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: "Terlalu banyak permintaan, coba lagi.",
// });

const allowedOrigins = process.env.ORIGIN.split(",");
app.use(
  cors({
    // origin: function (origin, callback) {
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    origin: '*',
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

// app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// handleSocket(server)

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