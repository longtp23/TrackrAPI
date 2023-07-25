import { json } from "express";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const newReview = new Review({
      userId: req.params.userId,
      gameId: req.body.gameId,
      rating: req.body.rating,
      username: req.body.username,
      storeName: req.body.storeName,
      reviewContent: req.body.reviewContent,
    });
    const savedReview = await newReview.save();
    res.status(200).json({ message: "Review Submitted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (req.query.userId === review.userId) {
      const newContent = req.body.newContent;
      const updatedTimestamp = Date.now();
      review.content = newContent;
      review.timeStamp = updatedTimestamp;
      const editedReview = await review.save();
      res.status(200).json(editedReview);
    } else {
      res.json({ message: "You're not allowed" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReviewsNumbers = async (req, res) => {
  try {
    const reviews = await Review.find().count();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReviews = async (req, res) => {
  const page = parseInt(req.query.page);
  const reviewsPerPage = parseInt(req.query.reviewsPerPage);
  try {
    const skipCount = (page - 1) * reviewsPerPage;
    const reviews = await Review.find().skip(skipCount).limit(reviewsPerPage);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ userId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReviewCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ userId });
    res.status(200).json(reviews.length);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReviewsByGame = async (req, res) => {
  const page = parseInt(req.query.page);
  const reviewsPerPage = parseInt(req.query.reviewsPerPage);
  const gameId = req.params.gameId;
  try {
    const skipCount = (page - 1) * reviewsPerPage;
    const reviews = await Review.find({ gameId })
      .skip(skipCount)
      .limit(reviewsPerPage);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const isHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    const helpfulArr = review.helpful;
    const type = req.query.type;
    const helpfulUserId = req.query.userId;
    const existedHelpful = helpfulArr.find(
      (rating) => rating.helpfulUserId === helpfulUserId
    );
    if (!existedHelpful) {
      helpfulArr.push({ type, helpfulUserId });
    } else {
      if (existedHelpful.type === type) {
        const index = helpfulArr.indexOf(existedHelpful);
        helpfulArr.splice(index, 1);
      }
      if (existedHelpful.type !== type) {
        existedHelpful.type = type;
      }
    }
    const savedReview = await review.save();
    res.status(200).json(savedReview);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const reply = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    const replyUserId = req.query.replyUserId;
    const replyTimeStamp = Date.now();
    const replyUsername = req.body.replyUsername;
    const replyContent = req.body.replyContent;
    review.replies.push({
      replyUserId,
      replyTimeStamp,
      replyContent,
      replyUsername,
    });
    const savedReview = await review.save();
    res.status(200).json({ message: "Reply Submitted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editReply = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    const reply = review.replies.find(
      (reply) => reply._id.toString() === req.query.replyId
    );
    const replyUserId = req.query.replyUserId;
    if (reply.replyUserId === replyUserId) {
      const newReplyContent = req.body.newReplyContent;
      reply.replyContent = newReplyContent;
      reply.replyTimeStamp = Date.now();
      const editedReply = await review.save();
      res.status(200).json(editedReply);
    } else {
      res.json({ message: "You're not allowed!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const filterReviews = async (req, res) => {
  const reviewsPerPage = parseInt(req.query.reviewsPerPage);
  const page = parseInt(req.query.page);
  const { ratings, helpful, timePosted } = req.body;
  try {
    let query = {};

    if (ratings && ratings.length > 0) {
      query.rating = { $in: ratings };
    }

    if (helpful === 'helpful') {
      query.helpful = { $elemMatch: { type: 'helpful' } };
    }

    if (helpful === 'notHelpful') {
      query.helpful = { $elemMatch: { type: 'notHelpful' } };
    }

    const sortDirection = timePosted === 'latest' ? -1 : 1;
    const reviews = await Review.aggregate([
      { $match: query },
      { $sort: { 'helpful.length': helpful === 'helpful' ? -1 : 1, timeStamp: sortDirection } },
      { $skip: (page - 1) * reviewsPerPage },
      { $limit: reviewsPerPage }
    ]);

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
