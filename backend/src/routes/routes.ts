import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { addPaymentMethod, getPaymentMethods } from "../controllers/payment";
import {
	addFavoriteRoute,
	getFavoriteRoutes,
	removeFavoriteRoute,
} from "../controllers/routes";

const router = express.Router();

router.get("/getFavoriteRoutes", authenticateToken, getFavoriteRoutes);
router.post("/addFavoriteRoute", authenticateToken, addFavoriteRoute);
router.post("/removeFavoriteRoute", authenticateToken, removeFavoriteRoute);

export default router;
