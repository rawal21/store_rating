import { Router } from "express";
import userRoutes from "@/user/user.routes";
import storeRoutes from "@/store/store.routes";
import ratingRoutes from "@/rating/rating.routes";
import adminRoutes from "@/admin/admin.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/stores", storeRoutes);
router.use("/ratings", ratingRoutes);
router.use("/admin", adminRoutes);

export default router;
