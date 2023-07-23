import Collection from "../models/Collection.js";
import { publicRequest } from "../utils/requestMethod.js";

const createCollection = async (req, res, userId, newGame) => {
  try {
    const newCollection = await Collection.create({ userId, games: newGame });
    return newCollection;
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getCollection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = await Collection.findOne({ userId });
    if (!collection) {
     const newCollection = await createCollection(req, res, userId);
     res.status(200).json(newCollection)
    } else {
      res.status(200).json(collection);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getCollectionGameCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = await Collection.findOne({ userId });
    if (!collection) {
      return res.status(200).json(0);
    } else {
      return res.status(200).json(collection.games.length);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getCollectionGameReleaseYear = async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = await Collection.findOne({ userId });
    const games = collection.games;
    const gamesEachYear = {};
    for (const game of games) {
      const year = game.releaseYear;
      if (gamesEachYear.hasOwnProperty(year)) {
        gamesEachYear[year] += 1;
      } else {
        gamesEachYear[year] = 1;
      }
    }
    res.status(200).json(gamesEachYear);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getCollectionDeveloperGenres = async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = await Collection.findOne({ userId });
    const collectionGames = collection.games;
    const games = [];
    for (const collectionGame of collectionGames) {
      const gameData = await publicRequest(`/game/${collectionGame.gameId}`);
      games.push({
        genres: gameData.data.genres,
        developers: gameData.data.developers,
      });
    }
    const genreCount = {};
    const developerCount = {};

    games.forEach((game) => {
      game.genres.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });

      game.developers.forEach((developer) => {
        developerCount[developer] = (developerCount[developer] || 0) + 1;
      });
    });

    // Get top 5 genres with percentage (rounded)
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genres, count], index, arr) => ({
        genres,
        count,
        percentage: ((count / arr[0][1]) * 100).toFixed(2),
      }));

    // Get top 5 developers with percentage (rounded)
    const topDevelopers = Object.entries(developerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([developers, count], index, arr) => ({
        developers,
        count,
        percentage: ((count / arr[0][1]) * 100).toFixed(2),
      }));
    const numGenres = Object.keys(genreCount).length;
    const numDevelopers = Object.keys(developerCount).length;
    res.status(200).json({ genres: topGenres, developers: topDevelopers, numGenres, numDevelopers });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addGameToCollection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newGame = req.body.game;
    const collection = await Collection.findOne({ userId });
    if (!collection) {
      await createCollection(req, res, userId, newGame);
      res
        .status(200)
        .json({ type: "success", message: "Game added to collection" });
    } else {
      const gamesInCollection = collection.games;
      if (gamesInCollection.length === 0) {
        gamesInCollection.push(newGame);
        await collection.save();
        res
          .status(200)
          .json({ type: "success", message: "Game added to collection" });
      } else {
        const gameExisted = gamesInCollection.some(
          (item) => item.gameId === newGame.gameId
        );
        if (gameExisted) {
          return res.json({
            message: "The game is already in your collection",
            type: "error",
          });
        } else {
          gamesInCollection.push(newGame);
          await collection.save();
          res
            .status(200)
            .json({ type: "success", message: "Game added to collection" });
        }
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteGameFromCollection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const collection = await Collection.findOne({ userId });
    collection.games = collection.games.filter(
      (game) => game.gameId !== gameId
    );
    await collection.save();
    res.status(200).json({collection, message:"Game deleted from collection", type:"success"});
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateGameCatagory = async (req, res) => {
  try {
    const userId = req.params.userId
    const gameId = req.params.gameId;
    const newCatagory = req.body.catagory;
    const collection = await Collection.findOne({userId});
    const game = collection.games.find((game) => game.gameId === gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });
    game.catagory = newCatagory;
    await collection.save();
    res.status(200).json({collection, type:"success", message:"Collection updated!"});
  } catch (error) {
    res.status(500).json(error);
  }
};
