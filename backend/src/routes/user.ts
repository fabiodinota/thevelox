import express from "express";
import { getUser, updateAccountInfo } from "../controllers/user";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get("/getUser", authenticateToken, getUser);
router.post("/updateAccountInfo", authenticateToken, updateAccountInfo);

export default router;
