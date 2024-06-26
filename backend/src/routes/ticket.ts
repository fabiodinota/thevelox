import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {
	buyTicket,
	getActiveTickets,
	getTicketHistory,
} from "../controllers/ticket";

const router = express.Router();

router.post("/buyTicket", authenticateToken, buyTicket);
router.get("/getActiveTickets", authenticateToken, getActiveTickets);
router.get("/getTicketHistory", authenticateToken, getTicketHistory);

export default router;
