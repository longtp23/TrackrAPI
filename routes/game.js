import express from "express";
import {
  addGames,
  addOneGame,
  changeGameStatus,
  deleteGame,
  gameFilter,
  getGameNumbers,
  getGameTitles,
  getGames,
  getGamesById,
  getGamesPaging,
  getRandomGames,
  searchGame,
  searchGameByName,
  searchGameBySlug,
} from "../controllers/game-controller.js";

import {verifyTokenAndAdmin} from "../utils/verifyTokens.js"

const router = express.Router();

router.post("/", addGames);

router.post("/addOneGame", verifyTokenAndAdmin, addOneGame)

router.post("/search", searchGame)

router.get("/getGameNumbers", getGameNumbers)

router.post("/searchName", searchGameByName);

router.post("/searchCat", gameFilter);

router.get("/searchSlug/:slug", searchGameBySlug);

router.get("/:gameId", getGamesById)

router.get("/all", getGames);

router.get("/", getGamesPaging);

router.get("/searchTitles", getGameTitles)

router.get("/random/:numberOfGames", getRandomGames);

router.delete("/:id", deleteGame);

router.put("/status/:gameId", verifyTokenAndAdmin, changeGameStatus)

export default router;
