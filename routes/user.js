import express from "express";
import {   getUserEachMonth, getUserInfo, getUsersByUsernameOrEmail, getUsersNumbers, notifyUsers, updateStatus, updateUserInfo } from "../controllers/user-controller.js";
import {verifyTokenAndAdmin, verifyTokenAndAuthorization} from "../utils/verifyTokens.js"

const router = express.Router();

router.get("/", notifyUsers)

router.get("/getUserInfo/:userId", verifyTokenAndAuthorization, getUserInfo)

router.put("/updateUserInfo/:userId", verifyTokenAndAuthorization, updateUserInfo);

router.get("/getUsersNumbers", getUsersNumbers)

router.get("/getUserEachMonth", getUserEachMonth)

router.get("/getUsersList", getUsersByUsernameOrEmail)

router.put("/updateStatus/:userId", verifyTokenAndAdmin, updateStatus)

export default router