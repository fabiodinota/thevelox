import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
	addPaymentMethod,
	deletePaymentMethod,
	getPaymentMethods,
} from "../controllers/payment";

const router = express.Router();

router.get("/getPaymentMethods", authenticateToken, getPaymentMethods);
router.post("/addPaymentMethod", authenticateToken, addPaymentMethod);
router.delete("/deletePaymentMethod", authenticateToken, deletePaymentMethod);

export default router;
