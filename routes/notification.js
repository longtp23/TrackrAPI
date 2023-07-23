import express from "express"
import { getNotifications } from "../controllers/notification-controller.js"
import { verifyTokenAndAuthorization } from "../utils/verifyTokens.js";

const router = express.Router()

router.get("/:userId", verifyTokenAndAuthorization, getNotifications)

export default router