import { DataPages } from "./pages.js";

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
      page: processo,
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
      content: `
    <span style="display: none">Geral</span>
    <h1>${DataPages[processo].title}</h1>
    <p>${DataPages[processo].text}<p>`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar conteúdo dinâmico.");
  }
};

export { RespIA, Chatpages, AcessPages, GetPageContent };
