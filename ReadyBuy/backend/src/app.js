import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import notFound from "./shared/middleware/notFound.middleware.js";
import errorHandler from "./shared/middleware/error.middleware.js";
import compression from "compression";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/carts/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec, } from "./config/swagger.js";

import adminRoutes from "./modules/admin/admin.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import couponRoutes from "./modules/coupons/coupon.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";

const app = express();
app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/admin/dashboard", dashboardRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;