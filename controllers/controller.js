import { DataPages } from "./pages.js";
import { ImageReader } from "../configs/tesseract.js";
import { responseAI } from "./osvaldoAI.js";
import { ReadTab, addConversation } from "./excel.js";
import { pool } from "../configs/db.js";
import { ConsultChat, InsertChat, DeleteChat } from "../db/configTables.js";

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

  if (chats) {
    chats.sort((a, b) => a.id - b.id);
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

    if (chats) {
      chats.sort((a, b) => a.id - b.id);
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

  let userMessage = message;
  let messageDB = message;

  if (req.file) {
    const { filename, path: filePath } = req.file;
    const reader = await ImageReader(filePath);

    let updatedPath = filePath.replace(/\\/g, "/").slice(6);
    console.log(updatedPath);

    userMessage = `[${userMessage}: ${reader}]`;
    messageDB = `<img src="${updatedPath}" alt=${filename}> <br> ${message}`;
  }
  try {
    const history = await ConsultChat(user_id, subject.toLowerCase());

    if (history) {
      history.sort((a, b) => a.id - b.id);
    }

    const base = await ReadTab(subject.toLowerCase(), "base");
    const response = await responseAI(
      subject,
      userMessage,
      history || null,
      base || null
    );

    //adicionado conversa na base
    await InsertChat(user_id, subject, messageDB, response);

    res.json({ resp: `${response}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const ClearChat = async (req, res) => {
  const { subject, user_id } = req.body;

  try {
    let clear;
    const response = await DeleteChat(user_id, subject);

    if (response.length > 0) {
      clear = true;
    } else {
      clear = false;
    }

    res.json({
      resp: clear,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao deletar chat");
  }
};

export { RespIA, Chatpages, AcessPages, GetPageContent, SendResp, ClearChat };
