import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  games: [
    {
      gameId: { type: String },
      gameImg: { type: String },
      gameTitle: { type: String },
      gameSlug: { type: String },
      releaseYear: { type: Number },
      catagory: { type: String, default: "uncatagorized" },
    },
  ],
});

export default mongoose.model("Collection", CollectionSchema);
