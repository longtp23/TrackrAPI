import express from "express";
import { verifyTokenAndAuthorization } from "../utils/verifyTokens.js";
import {
  addGameToCollection,
  deleteGameFromCollection,
  getCollection,
  getCollectionDeveloperGenres,
  getCollectionGameCount,
  getCollectionGameReleaseYear,
  updateGameCatagory,
} from "../controllers/collection-controller.js";

const router = express.Router();

router.get("/:userId", verifyTokenAndAuthorization, getCollection);

router.get("/gameCount/:userId", verifyTokenAndAuthorization, getCollectionGameCount)

router.get("/gameEachYear/:userId", verifyTokenAndAuthorization, getCollectionGameReleaseYear);

router.get("/topDevGernes/:userId", verifyTokenAndAuthorization, getCollectionDeveloperGenres)

router.put("/addGame/:userId", verifyTokenAndAuthorization, addGameToCollection);

router.delete(
  "/:userId/:gameId",
  verifyTokenAndAuthorization,
  deleteGameFromCollection
);

router.put("/updateCatagory/:userId/:gameId", verifyTokenAndAuthorization, updateGameCatagory);


export default router;
