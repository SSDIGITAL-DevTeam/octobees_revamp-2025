import express from "express";
// Controllers
//import ServiceCatController from "./service-category/service-category.controller.js";
import ServiceCatRoutes from "./service-category/service-category.route.js";

import ServiceCatBackOfficeRoutes from "./service-category/service-category-back-office.route.js";
import ServicePlanController from "./service-plan/service-plan.route.js";
import OrderController from "./order/order.controller.js";
// import RoleController from "../role/role.controller.js";
import MetaController from "./meta/meta.controller.js";
import PageController from "./page/page.controller.js";
import UserController from "./user/user.route.js";
import loginController from "./auth/login/login.controller.js";
import logoutController from "./auth/logout/logout.controller.js";
// import refreshToken from "./auth/refresh-token/refresh.controller.js";
import blog from "./blog/_blog.route.js";
import blogcat from "./blog-category/_blog-category.route.js";
import career from "./career/_career.route.js";
import position from "./position/_position.route.js";
import subscription from "./subscription/_subscription.route.js";

// Middleware
// import verifyToken from "../middleware/verify.token.js";
// import { upload } from "../middleware/uploadImage.js";
const router = express.Router();

//Auth Routes
// router.use("/auth/refresh-token", refreshToken);
router.use("/auth/login", loginController);
router.use("/auth/logout", logoutController);

// API Routes
router.use("/v1/career", career.endUser);
router.use("/v1/position", position.endUser);
router.use("/v1/blog-category", blogcat.endUser);
router.use("/v1/blog", blog.endUser);
router.use("/v1/subscription", subscription.endUser);
router.use("/v1/service-category", ServiceCatRoutes);
router.use("/v1/plan", ServicePlanController);
router.use("/v1/page", PageController);
router.use("/v1/order", OrderController);
router.use("/v1/meta", MetaController);
router.use("/v1/user", UserController);
//router.use("/v1/blog", BlogController);

router.use("/v1/back-office", (req, res, next) => {
  const backOfficeRouter = express.Router();
  backOfficeRouter.use("/blog", blog.backOffice);
  backOfficeRouter.use("/career", career.backOffice);
  backOfficeRouter.use("/position", position.backOffice);
  backOfficeRouter.use("/blog-category", blogcat.backOffice);
  backOfficeRouter.use("/subscription", subscription.backOffice);
  backOfficeRouter.use("/service-category", ServiceCatBackOfficeRoutes);
  backOfficeRouter.use("/plan", ServicePlanController);
  backOfficeRouter.use("/meta", MetaController);
  backOfficeRouter(req, res, next);
});

// Uncomment if needed:
// router.use("/v1/role", RoleController);
// router.use("/v1/meta", MetaController);
// router.use("/v1/page", PageController);
// router.use("/v1/blog-category", BlogCategoryController);
// router.use("/v1/blog", upload.single("image"), BlogController);

export default router;
