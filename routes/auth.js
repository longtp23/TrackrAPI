import express from "express"
import { checkPassword, login, register } from "../controllers/auth-controller.js";
import {verifyTokenAndAuthorization} from "../utils/verifyTokens.js"

const router = express.Router();

router.post("/login", login)
router.post("/register", register)
router.post("/checkPassword/:userId", verifyTokenAndAuthorization, checkPassword)

export default router