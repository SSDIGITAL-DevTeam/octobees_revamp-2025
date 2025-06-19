import express from "express";
// Controllers
//import ServiceCatController from "./service-category/service-category.controller.js";

import ServicePlanController from "./service-plan/service-plan.route.js";
import OrderController from "./order/order.controller.js";
// import RoleController from "../role/role.controller.js";
// import MetaController from "./meta/meta.controller.js";
import user from "./user/_user.route.js";
import refreshToken from "./auth/refresh-token/refresh.controller.js";
import login from "./auth/login/login.controller.js";
import logout from "./auth/logout/logout.controller.js";
import blog from "./blog/_blog.route.js";
import blogcat from "./blog-category/_blog-category.route.js";
import career from "./career/_career.route.js";
import position from "./position/_position.route.js";
import subscription from "./subscription/_subscription.route.js";
import page from "./page/_page.route.js";
import category from "./service-category/_service-category.route.js";
import meta from "./meta/_meta.route.js"
import forgot from "./auth/forgot-password/forgot-password.controller.js"
import reset from "./auth/reset-password/reset-password.controller.js"
// Middleware
// import verifyToken from "../middleware/verify.token.js";
// import { upload } from "../middleware/uploadImage.js";
const router = express.Router();

//Auth Routes
router.use("/auth/refresh-token", refreshToken);
router.use("/auth/login", login);
router.use("/auth/logout", logout);
router.use("/auth/forgot-password", forgot);
router.use("/auth/reset-password", reset);

// API Routes
router.use("/v1/page", page.endUser);
router.use("/v1/meta", meta.endUser);
router.use("/v1/blog", blog.endUser);
router.use("/v1/career", career.endUser);
router.use("/v1/position", position.endUser);
router.use("/v1/blog-category", blogcat.endUser);
router.use("/v1/subscription", subscription.endUser);
router.use("/v1/service-category", category.endUser);
router.use("/v1/user", user.endUser);
router.use("/v1/plan", ServicePlanController);
router.use("/v1/order", OrderController);
//router.use("/v1/blog", BlogController);

router.use("/v1/back-office", (req, res, next) => {
  const backOfficeRouter = express.Router();
  backOfficeRouter.use("/blog", blog.backOffice);
  backOfficeRouter.use("/user", user.backOffice);
  backOfficeRouter.use("/meta", meta.backOffice);
  backOfficeRouter.use("/page", page.backOffice);
  backOfficeRouter.use("/career", career.backOffice);
  backOfficeRouter.use("/position", position.backOffice);
  backOfficeRouter.use("/blog-category", blogcat.backOffice);
  backOfficeRouter.use("/subscription", subscription.backOffice);
  backOfficeRouter.use("/service-category", category.backOffice);
  backOfficeRouter.use("/plan", ServicePlanController);
  backOfficeRouter(req, res, next);
});

export default router;
