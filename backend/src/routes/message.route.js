import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/message.controller.js";
import verifyRequest from "../middleware/verifyRequest.js";
const router = Router();

router.route("/create-message").post(verifyRequest, createMessage);
router.route("/get-messages").get(verifyRequest, getMessages);
export default router;
