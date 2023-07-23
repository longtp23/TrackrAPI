import Wishlist from "../models/Wishlist.js";

const createWishlist = async (req, res, userId, newGame) => {
  try {
    const newWishlist = new Wishlist({
      userId,
      games: newGame,
    });
    const savedWishlist = await newWishlist.save();
    return savedWishlist;
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      const newWishlist = await createWishlist(req, res, userId);
      res.status(200).json(newWishlist);
    } else {
      res.status(200).json(wishlist);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getWislistCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      res.status(200).json(0);
    } else {
      res.status(200).json(wishlist.games.length);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wishlist = await Wishlist.findOne({ userId });
    const newGame = req.body.game;
    if (!wishlist) {
      await createWishlist(req, res, userId, newGame);
      res
        .status(200)
        .json({ type: "success", message: "Game added to wishlist!" });
    } else {
      const gamesInWishlist = wishlist.games;
      if (gamesInWishlist.length === 0) {
        gamesInWishlist.push(newGame);
        await wishlist.save();
        res
          .status(200)
          .json({ type: "success", message: "Game added to wishlist" });
      } else {
        const gameExisted = gamesInWishlist.some(
          (item) => item.gameId === newGame.gameId
        );
        if (gameExisted) {
          return res.json({
            message: "The game is already in your wishlist",
            type: "error",
          });
        } else {
          gamesInWishlist.push(newGame);
          await wishlist.save();
          res
            .status(200)
            .json({ type: "success", message: "Game added to wishlist" });
        }
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteGameFromWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const wishlist = await Wishlist.findOne({ userId });
    const index = wishlist.games.findIndex((item) => item.gameId === gameId);
    if (index !== -1) {
      wishlist.games.splice(index, 1);
      await wishlist.save();
      res
        .status(200)
        .json({wishlist, type: "success", message: "Game deleted from wishlist!" });
    } else res.json({ message: "Game not found", type: "error" });
  } catch (error) {
    res.status(500).json(error);
  }
};
