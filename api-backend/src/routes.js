// routes/index.js
import express from "express";

// Controllers
//import ServiceCatController from "./service-category/service-category.controller.js";
import ServiceCatRoutes from "./service-category/service-category.route.js";

import ServiceCatBackOfficeRoutes from  "./service-category/service-category-back-office.route.js"
import ServicePlanController from "./service-plan/service-plan.controller.js";
import OrderController from "./order/order.controller.js";
// import RoleController from "../role/role.controller.js";
// import MetaController from "../meta/meta.controller.js";
// import PageController from "../pages/pages.controller.js";
// import BlogCategoryController from "../blog-category/blog-category.controller.js";
// import BlogController from "../blog/blog.controller.js";
// import loginController from "../auth/login/login.controller.js";
// import refreshToken from "../auth/refresh-token/refresh.controller.js";
// import logoutController from "../auth/logout/logout.controller.js";

// Middleware
// import verifyToken from "../middleware/verify.token.js";
// import { upload } from "../middleware/uploadImage.js";
const router = express.Router();



// Auth Routes
// router.use("/auth/refresh-token", refreshToken);
// router.use("/auth/login", loginController);
// router.use("/auth/logout", logoutController);

// API Routes
router.use("/v1/service-category", ServiceCatRoutes);
router.use("/v1/plan", ServicePlanController);
router.use("/v1/order", OrderController);
router.use("/v1/back-office", (req, res, next) => {
    const backOfficeRouter = express.Router();
  
    // BACK-OFFICE ROUTES (same controllers, can be extended with auth middleware)
    backOfficeRouter.use("/service-category", ServiceCatBackOfficeRoutes);
    
   // backOfficeRouter.use("/service-category", ServiceCatRoutes);
    backOfficeRouter.use("/plan", ServicePlanController);
    backOfficeRouter.use("/order", OrderController);
  
    backOfficeRouter(req, res, next);
  });

// Uncomment if needed:
// router.use("/v1/role", RoleController);
// router.use("/v1/meta", MetaController);
// router.use("/v1/page", PageController);
// router.use("/v1/blog-category", BlogCategoryController);
// router.use("/v1/blog", upload.single("image"), BlogController);

export default router;
