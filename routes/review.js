import express from "express";
import { verifyTokenAndAuthorization } from "../utils/verifyTokens.js";
import { addReview, editReply, editReview, getReviewCount, getReviews, getReviewsByGame, getReviewsNumbers, getUserReviews, isHelpful, reply } from "../controllers/review-controller.js";

const router = express.Router();

router.post("/:userId", verifyTokenAndAuthorization, addReview);

router.put("/edit/:reviewId",verifyTokenAndAuthorization, editReview)

router.get("/", getReviews)

router.get("/getReviewsNumbers", getReviewsNumbers)

router.get("/:userId", getUserReviews)

router.get("/reviewCount/:userId", verifyTokenAndAuthorization, getReviewCount)

router.get("/game/:gameId",getReviewsByGame )

router.put("/isHelpful/:reviewId", verifyTokenAndAuthorization, isHelpful)

router.put("/reply/:reviewId",verifyTokenAndAuthorization, reply)

router.put("/reply/edit/:reviewId", verifyTokenAndAuthorization, editReply)

export default router;
