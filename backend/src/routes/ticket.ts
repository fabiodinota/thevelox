import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createTicket } from "../controllers/ticket";

const router = express.Router();

router.post("/createTicket", authenticateToken, createTicket);

export default router;
