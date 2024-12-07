import express from "express";
import {
  RespIA,
  Chatpages,
  AcessPages,
  GetPageContent,
  SendResp,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/chats", Chatpages);
router.get("/chats/:processo", AcessPages);
router.get("/chats/c/:processo", GetPageContent);
router.post("/chats/send/message", SendResp);

//router.get("/", RespIA);

export { router };
