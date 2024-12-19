import express from "express";
import dotenv from "dotenv";
import auth0 from "express-openid-connect";
import { router } from "./routes/index.js";
import { createTables } from "./db/createTables.js";
import { InsertUser } from "./db/configTables.js";
import open from "open";

dotenv.config();
const { auth } = auth0;
const app = express();
const PORT = 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//createTables();
//InsertUser("MBS1729", "mauricio.santos", "mauricio.santos@gruposc.com.br");

app.use(auth(config));
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  //open(`http://localhost:${PORT}`);
});
