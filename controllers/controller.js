import { DataPages } from "./pages.js";
import { responseAI } from "./geminiAI.js";

const RespIA = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const Chatpages = (req, res) => {
  try {
    res.redirect("/chats/segregados");
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const AcessPages = (req, res) => {
  const { processo } = req.params;
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
  const { processo } = req.params;
  try {
    res.json({
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
  const { subject, message } = req.body;
  try {
    const response = await responseAI(message);
    res.json({ resp: `${response}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

export { RespIA, Chatpages, AcessPages, GetPageContent, SendResp };
