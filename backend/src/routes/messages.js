import { Router } from "express";
const router = Router();
import {
  getConversations,
  getMessagesByWaId,
  postMessage,
} from "../controllers/messageController.js";

router.get("/conversations", getConversations);
router.get("/messages/:wa_id", getMessagesByWaId);
router.post("/message", postMessage);

export default router;
