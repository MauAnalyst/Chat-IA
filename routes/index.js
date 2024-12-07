import express from "express";
import { RespIA, Chatpages, AcessPages } from "../controllers/controller.js";

const router = express.Router();

router.get("/chats", Chatpages);
router.get("/chats/:processo", AcessPages);
//router.get("/", RespIA);

export { router };
