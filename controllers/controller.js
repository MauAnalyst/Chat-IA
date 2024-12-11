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

const AcessPages = (req, res) => {
  const { processo, user_id } = req.params;
  try {
    res.render("layout", {
      title: processo,
      // page: ,
      content: `<span style="display: none">${DataPages[processo].span}</span>
      <h1>${DataPages[processo].title}</h1>
      <p>${DataPages[processo].text}<p>`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const GetPageContent = (req, res) => {
  const { processo, user_id } = req.params;

  console.log(user_id);
  try {
    res.json({
      title: processo,
      content: `<span style="display: none">${DataPages[processo].span}</span>
      <h1>${DataPages[processo].title}</h1>
      <p>${DataPages[processo].text}<p>`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar conteúdo dinâmico.");
  }
};

const SendResp = async (req, res) => {
  const { subject, message, history, user } = req.body;
  try {
    //search user

    const chats = await pool.query("SELECT NOW() AS data_atual");
    console.log(chats.rows[0]);

    const base = await ReadTab(subject.toLowerCase(), "base");

    const response = await responseAI(message, history, base || "sem dados");

    //adicionado conversa ao chat
    // await addConversation(
    //   user,
    //   subject.toLowerCase(),
    //   message,
    //   response,
    //   "history-chats"
    // );

    res.json({ resp: `${response}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

export { RespIA, Chatpages, AcessPages, GetPageContent, SendResp };
