import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/index.js";
import open from "open";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  //open(`http://localhost:${PORT}`);
});
