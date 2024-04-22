import { Router } from "express";
import { signIn, signOut, signUp, verifyToken } from "../controllers/auth";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verifyToken", authenticateToken, verifyToken);
router.get("/signout", authenticateToken, signOut);
router.get("/isAuthenticated", (req, res) => {
	const { accessToken, refreshToken } = req.cookies;

	res.json({
		isAuthenticated: Boolean(accessToken && refreshToken),
		refreshToken: Boolean(refreshToken),
		accessToken: Boolean(accessToken),
	});
});

export default router;
