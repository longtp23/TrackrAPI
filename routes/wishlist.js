import express from "express"
import { verifyTokenAndAuthorization } from "../utils/verifyTokens.js"
import { addToWishlist, deleteGameFromWishlist, getWishlist, getWislistCount } from "../controllers/wishlist-controller.js"

const router = express.Router()

router.put("/addGame/:userId", verifyTokenAndAuthorization, addToWishlist)

router.get("/:userId", verifyTokenAndAuthorization, getWishlist)

router.get("/gameCount/:userId", verifyTokenAndAuthorization, getWislistCount)

router.delete("/:userId/:gameId", verifyTokenAndAuthorization, deleteGameFromWishlist)

export default router