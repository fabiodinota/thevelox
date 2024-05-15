import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { deleteTicket, deleteUser, getAllUsers } from "../controllers/admin";

const router = express.Router();

router.get("/getAllUsers", authenticateToken, getAllUsers);
router.delete("/deleteUser", authenticateToken, deleteUser);
router.delete("/deleteTicket", authenticateToken, deleteTicket);

export default router;
