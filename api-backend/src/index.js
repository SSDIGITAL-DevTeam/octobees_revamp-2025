import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
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
import verifyToken from "./middleware/verify.token.js";
import { upload } from "./middleware/uploadImage.js";

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

// app.use(
//   cors({
//     origin: process.env.ORIGIN,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

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
// app.use("/api/auth/refresh-token", refreshToken);
// app.use("/api/auth/login", loginController);
// app.use("/api/auth/logout", logoutController);
// app.use("/api/v1/service-category", ServiceCatController);
// app.use("/api/v1/plan", ServicePlanController);
// app.use("/api/v1/order", OrderController);
// app.use("/api/v1/role", RoleController);

// app.use("/api/v1/meta", MetaController);
// app.use("/api/v1/page", PageController);
// app.use("/api/v1/order", OrderController);
// app.use("/api/v1/blog-category", BlogCategoryController);
// app.use("/api/v1/blog", upload.single("image"), BlogController);

const server = app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));
export default server;