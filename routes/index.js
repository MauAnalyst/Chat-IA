import express from "express";
import {
  RespIA,
  Chatpages,
  AcessPages,
  GetPageContent,
  SendResp,
  ClearChat,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/chats", Chatpages);
router.get("/chats/:processo/:user_id", AcessPages);
router.get("/chats/c/:processo/:user_id", GetPageContent);
router.post("/chats/send/message", SendResp);
router.post("/chats/delete-chat", ClearChat);

//router.get("/", RespIA);

export { router };
