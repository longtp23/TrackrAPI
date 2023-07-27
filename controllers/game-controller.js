import Game from "../models/Game.js";
import User from "../models/User.js";
import { publicRequest } from "../utils/requestMethod.js";

export const addGames = async (req, res) => {
  const gamesData = req.body.games;
  try {
    const newGames = [];

    for (const gameData of gamesData) {
      const { title } = gameData;

      // Check if the game copy already exists
      const existingGame = await Game.findOne({ title });

      if (existingGame) {
        console.log(`Skipping existing game copy: ${title}`);
        continue; // Skip to the next game copy
      }

      const newGame = await Game.create(gameData);
      newGames.push(newGame);
    }

    res.status(200).json(newGames);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addOneGame = async (req, res) => {
  try {

    const existingGame = await Game.findOne({slug: req.body.slug})
    if(existingGame) return res.status(200).json({type:"error", message:"Slug existed!"})

    const newGame = new Game({
      title: req.body.title,
      slug: req.body.slug,
      releaseDate: req.body.releaseDate,
    platforms: req.body.platforms,
      genres: req.body.genres,
      developers: req.body.developers,
      publishers: req.body.publishers,
      metaScore: req.body.metaScore,
      backgroundImage: req.body.backgroundImage,
      shortScreenshots: req.body.shortScreenshots,
      description: req.body.description,
    });
    await newGame.save();
    res.status(200).json({ type: "success", message: "Game added!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGameNumbers = async (rea, res) => {
  try {
    const games = await Game.find().count();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const searchGameByName = async (req, res) => {
  const { title } = req.body;
  try {
    const game = await Game.find({
      title: { $regex: new RegExp(title, "i") },
    });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const searchGame = async (req, res) => {
  const { searchQuery } = req.body;
  const page = parseInt(req.query.page);
  const gamesPerPage = parseInt(req.query.gamesPerPage);
  const userId = req.query.userId;

  let query = {
    $or: [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { platforms: { $regex: new RegExp(searchQuery, "i") } },
      { genres: { $regex: new RegExp(searchQuery, "i") } },
      { publishers: { $regex: new RegExp(searchQuery, "i") } },
      { developers: { $regex: new RegExp(searchQuery, "i") } },
    ],
  };

  if (userId) {
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      // Show all games for admin
      query.isDisabled = { $ne: true };
    }
  } else {
    // Show only non-disabled games for non-admin users
    query.isDisabled = { $ne: true };
  }

  try {
    const skipCount = (page - 1) * gamesPerPage;
    const games = await Game.find(query).skip(skipCount).limit(gamesPerPage);

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const gameFilter = async (req, res) => {
  const { platforms, genres, price, searchQuery } = req.body;
  const userId = req.query.userId;
  const page = parseInt(req.query.page);
  const gamesPerPage = parseInt(req.query.gamesPerPage);

  let query = {};


  if (searchQuery) {
    query.$or = [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { platforms: { $regex: new RegExp(searchQuery, "i") } },
      { genres: { $regex: new RegExp(searchQuery, "i") } },
      { publishers: { $regex: new RegExp(searchQuery, "i") } },
      { developers: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  if (userId) {
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      // Show only non-disabled games for non-admin users
      query.isDisabled = { $ne: true };
    }
  } else {
    // Show only non-disabled games for non-admin users
    query.isDisabled = { $ne: true };
  }

  if (platforms && platforms.length > 0) {
    query.platforms = { $all: platforms };
  }
  if (genres && genres.length > 0) {
    query.genres = { $all: genres };
  }

  try {
    const skipCount = (page - 1) * gamesPerPage;
    let games;

    if (Object.keys(query).length > 0) {
      games = await Game.find(query).skip(skipCount).limit(gamesPerPage);
    } else {
      games = await Game.find().skip(skipCount).limit(gamesPerPage);
    }

    if (price) {
      const filteredGames = [];
      for (const game of games) {
        const filterPriceRes = await publicRequest.post(
          "/gameCopy/filterPrice?condition=" + price,
          { title: game.title }
        );

        if (filterPriceRes.data.message === true) {
          filteredGames.push(game);
        }
      }

      games = filteredGames;
    }

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const searchGameBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const game = await Game.findOne({
      slug,
    });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGamesById = async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const game = await Game.findById(gameId);
    res.status(200).json(game);
  } catch (error) {
    res.status(200).json(error);
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGamesPaging = async (req, res) => {
  const page = parseInt(req.query.page);
  const gamesPerPage = parseInt(req.query.gamesPerPage);

  try {
    const skipCount = (page - 1) * gamesPerPage;

    const games = await Game.find().skip(skipCount).limit(gamesPerPage);

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGameTitles = async (req, res) => {
  const page = parseInt(req.query.page);
  const gamesPerPage = parseInt(req.query.gamesPerPage);

  try {
    const skipCount = (page - 1) * gamesPerPage;

    const games = await Game.find().skip(skipCount).limit(gamesPerPage);

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getRandomGames = async (req, res) => {
  try {
    const numberOfGames = req.params.numberOfGames;
    const randomIndices = generateRandomIndices(30, numberOfGames); // Function to generate unique random indices
    const randomGames = await Game.find()
      .skip(randomIndices[0])
      .limit(numberOfGames);
    res.status(200).json(randomGames);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Function to generate unique random indices
const generateRandomIndices = (max, count) => {
  const indices = [];
  while (indices.length < count) {
    const index = Math.floor(Math.random() * max);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices;
};

export const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    const deletedGameTitle = game.title;
    await Game.findByIdAndDelete(id);
    console.log("Successfully Deleted", deletedGameTitle);
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const changeGameStatus = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);
    game.isDisabled = !game.isDisabled;
    await game.save();
    res
      .status(200)
      .json({ type: "success", message: "Game's Status Updated!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editGame = async (req, res) => {
  try {
    const {
      title,
      releaseDate,
      metaScore,
      developers,
      publishers,
      genres,
      platforms,
    } = req.body;
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);
    game.title = title;
    game.releaseDate = releaseDate;
    game.metaScore = metaScore;
    game.developers = developers;
    game.publishers = publishers;
    game.genres = genres;
    game.platforms = platforms;
    await game.save();
    res.status(200).json({ type: "success", message: "Game Updated!" });
  } catch (error) {
    res.status(500).json(error);
  }
};
