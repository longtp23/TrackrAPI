import express from "express";
import { verifyTokenAndAuthorization } from "../utils/verifyTokens.js";
import { addReview, deleteReview, editReply, editReview, filterReviews, getReviewCount, getReviews, getReviewsByGame, getReviewsNumbers, getUserReviews, isHelpful, reply } from "../controllers/review-controller.js";

const router = express.Router();

router.post("/filter", filterReviews)

router.post("/:userId", verifyTokenAndAuthorization, addReview);

router.put("/edit/:reviewId",verifyTokenAndAuthorization, editReview)

router.get("/", getReviews)

router.get("/getReviewsNumbers", getReviewsNumbers)

router.get("/:userId", getUserReviews)

router.get("/reviewCount/:userId", verifyTokenAndAuthorization, getReviewCount)

router.get("/game/:gameId",getReviewsByGame)

router.put("/isHelpful/:reviewId", verifyTokenAndAuthorization, isHelpful)

router.put("/reply/:reviewId",verifyTokenAndAuthorization, reply)

router.put("/reply/edit/:reviewId", verifyTokenAndAuthorization, editReply)

router.delete("/delete/:reviewId", verifyTokenAndAuthorization, deleteReview)
export default router;
