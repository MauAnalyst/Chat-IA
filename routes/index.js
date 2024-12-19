import express from "express";
import { upload } from "../configs/multer.js";
import auth0 from "express-openid-connect";
import {
  HomePage,
  Chatpages,
  AcessPages,
  GetPageContent,
  SendResp,
  ClearChat,
} from "../controllers/controller.js";

const router = express.Router();
const { requiresAuth } = auth0;

router.get("/", HomePage);

router.get("/chats", requiresAuth(), Chatpages);
router.get("/chats/:process", requiresAuth(), AcessPages);
router.get("/chats/c/:subject", requiresAuth(), GetPageContent);
router.post(
  "/chats/send/message",
  requiresAuth(),
  upload.single("image"),
  SendResp
);
router.post("/chats/send/delete-chat", requiresAuth(), ClearChat);

export { router };
