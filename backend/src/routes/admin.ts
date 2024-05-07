import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { deleteUser, getAllUsers } from "../controllers/admin";

const router = express.Router();

router.get("/getAllUsers", authenticateToken, getAllUsers);
router.delete("/deleteUser", authenticateToken, deleteUser);

export default router;
