import { DataPages } from "./pages.js";
import { ImageReader } from "../configs/tesseract.js";
import { responseAI } from "./osvaldoAI.js";
import { ReadTab } from "./excel.js";
import {
  InsertUser,
  ConsultUser,
  ConsultChat,
  InsertChat,
  DeleteChat,
} from "../db/configTables.js";

class UserLogin {
  constructor(user_id, user_name, user_email, user_picture, insertUserFn) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.user_email = user_email;
    this.user_picture = user_picture;
    this.insertUserFn = insertUserFn;
  }

  async saveUser() {
    try {
      return await this.insertUserFn(
        this.user_id,
        this.user_name,
        this.user_email
      );
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
    }
  }
}

const HomePage = async (req, res) => {
  const auth = req.oidc.isAuthenticated();
  let login = auth
    ? new UserLogin(
        req.oidc.user.sub,
        req.oidc.user.name,
        req.oidc.user.email,
        req.oidc.user.picture,
        InsertUser
      )
    : null;

  try {
    let layout = "";
    if (login) {
      const checkUserChat = await ConsultUser(login.user_id);

      if (!checkUserChat) {
        await login.saveUser();
      }
      layout = "homeLoggedIn";
    } else {
      layout = "homeLoggedOut";
    }

    res.render("home", { login, layout });
  } catch (error) {
    console.log("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const Chatpages = (req, res) => {
  try {
    res.redirect("/chats/chamados");
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const AcessPages = async (req, res) => {
  let login = new UserLogin(
    req.oidc.user.sub,
    req.oidc.user.name,
    req.oidc.user.email,
    req.oidc.user.picture
  );

  const { process } = req.params;

  if (!process || process === "null") {
    return res.status(400).json("Parâmetro inválido.");
  }

  const chats = await ConsultChat(login.user_id, process.toLowerCase());

  if (chats) {
    chats.sort((a, b) => a.id - b.id);
  }

  try {
    res.render("layout", {
      login,
      title: process,
      // page: ,
      content: `<span style="display: none">${DataPages[process].span}</span>
      <h1>${DataPages[process].title}</h1>
      <p>${DataPages[process].text}<p>`,
      chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao carregar a página.");
  }
};

const GetPageContent = async (req, res) => {
  const { subject } = req.params;

  let login = new UserLogin(
    req.oidc.user.sub,
    req.oidc.user.name,
    req.oidc.user.email,
    req.oidc.user.picture
  );

  try {
    const chats = await ConsultChat(login.user_id, subject.toLowerCase());

    if (chats) {
      chats.sort((a, b) => a.id - b.id);
    }

    res.json({
      login,
      title: subject,
      content: `<span style="display: none">${DataPages[subject].span}</span>
      <h1>${DataPages[subject].title}</h1>
      <p>${DataPages[subject].text}<p>`,
      chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar conteúdo.");
  }
};

const SendResp = async (req, res) => {
  const user_id = req.oidc.user.sub;
  const { subject, message } = req.body;

  let userMessage = message;
  let messageDB = message;

  if (req.file) {
    const { filename, path: filePath } = req.file;
    const reader = await ImageReader(filePath);

    let updatedPath = filePath.replace(/\\/g, "/").slice(6);

    userMessage = `[${userMessage}: (texto estraído da imagem) ${reader}]`;
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
  const user_id = req.oidc.user.sub;
  const { subject } = req.body;

  try {
    const response = await DeleteChat(user_id, subject);

    let clear = response.length > 0 ? true : false;

    res.json({
      resp: clear,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao deletar chat");
  }
};

export { HomePage, Chatpages, AcessPages, GetPageContent, SendResp, ClearChat };
