import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { getPaymentMethods } from "../controllers/payment";

const router = express.Router();

router.get("/getPaymentMethods", authenticateToken, getPaymentMethods);

export default router;
