import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { buyTicket } from "../controllers/ticket";

const router = express.Router();

router.post("/buyTicket", authenticateToken, buyTicket);

export default router;
