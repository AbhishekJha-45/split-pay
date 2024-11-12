import { Router } from "express";

import {
  createUser,
  listAllUsers,
  loginUser,
  logOutUser,
} from "../controllers/user.controller.js";
import verifyRequest from "../middleware/verifyRequest.js";

const router = Router();

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyRequest, logOutUser);
router.route("/list-users").get(verifyRequest, listAllUsers);
export default router;
