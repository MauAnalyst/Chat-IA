import { DataPages } from "./pages.js";
import { responseAI } from "./geminiAI.js";
import { ReadTab, addConversation } from "./excel.js";
import { pool } from "../configs/db.js";
import { ConsultChat, InsertChat } from "../db/configTables.js";

const RespIA = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const Chatpages = (req, res) => {
  try {
    res.redirect("/chats/geral");
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const AcessPages = async (req, res) => {
  const { processo, user_id } = req.params;

  const chats = await ConsultChat(user_id, processo.toLowerCase());

  if (!chats) {
    console.log("sem conversa");
  }

  try {
    res.render("layout", {
      title: processo,
      // page: ,
      content: `<span style="display: none">${DataPages[processo].span}</span>
      <h1>${DataPages[processo].title}</h1>
      <p>${DataPages[processo].text}<p>`,
      chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const GetPageContent = async (req, res) => {
  const { processo, user_id } = req.params;

  try {
    const chats = await ConsultChat(user_id, processo.toLowerCase());

    if (!chats) {
      console.log("sem conversa");
    }

    res.json({
      title: processo,
      content: `<span style="display: none">${DataPages[processo].span}</span>
      <h1>${DataPages[processo].title}</h1>
      <p>${DataPages[processo].text}<p>`,
      chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar conteúdo.");
  }
};

const SendResp = async (req, res) => {
  const { subject, message, user_id } = req.body;
  try {
    const history = await ConsultChat(user_id, subject.toLowerCase());

    const base = await ReadTab(subject.toLowerCase(), "base");
    const response = await responseAI(
      message,
      history || "sem histórico",
      base || "sem dados"
    );

    //adicionado conversa na base
    await InsertChat(user_id, subject, message, response);

    res.json({ resp: `${response}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

export { RespIA, Chatpages, AcessPages, GetPageContent, SendResp };
