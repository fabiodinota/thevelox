import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { addPaymentMethod, getPaymentMethods } from "../controllers/payment";

const router = express.Router();

router.get("/getPaymentMethods", authenticateToken, getPaymentMethods);
router.post("/addPaymentMethod", authenticateToken, addPaymentMethod);

export default router;
