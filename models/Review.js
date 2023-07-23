import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  gameId: { type: String, required: true },
  rating: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
  helpful: [
    {
      helpfulUserId: { type: String },
      type: { type: String },
    },
  ],
  storeName: { type: String, required: true },
  username: { type: String, required: true },
  reviewContent: { type: String, required: true },
  replies: [
    {
      replyUserId: { type: String },
      replyUsername: { type: String },
      replyTimeStamp: { type: Date },
      replyContent: { type: String },
    },
  ],
});

export default mongoose.model("Review", ReviewSchema);
