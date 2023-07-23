import express from "express";
import {
  addStore,
  addStores,
  getAllStores,
} from "../controllers/store-controller.js";

const router = express.Router();

// ADD 1 STORE
router.post("/", addStore);

// ADD MULTIPLE STORES
router.post("/multi", addStores);

// GET ALL STORES
router.get("/", getAllStores);

export default router;
