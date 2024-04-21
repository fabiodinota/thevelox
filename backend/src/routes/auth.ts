import { Router } from "express";
import { signIn, signOut, signUp, verifyToken } from "../controllers/auth";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verifyToken", authenticateToken, verifyToken);
router.get("/signout", authenticateToken, signOut);

export default router;
