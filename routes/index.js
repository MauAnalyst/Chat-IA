import express from "express";
import {
  RespIA,
  Chatpages,
  AcessPages,
  GetPageContent,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/chats", Chatpages);
router.get("/chats/:processo", AcessPages);
router.get("/chats/c/:processo", GetPageContent);

//router.get("/", RespIA);

export { router };
