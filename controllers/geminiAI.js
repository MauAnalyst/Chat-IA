import { GoogleGenerativeAI } from "@google/generative-ai";

import xlxx from "xlsx";
import dotenv from "dotenv";

dotenv.config();

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CreatePrompt = (question) => {
  return `
    Você é uma assistênte de suporte sistemas, bem gentil e empolgado, e fala somente o necessário. Mas apesar disso, vc faz de tudo para a pessoa entender o que diz, a não ser que a pergunta seja um pouco genérica, vc sempre pede mais detalhes nesses casos.
    Dito isso, responda a seguinte questão: ${question}
    `;
};

const returnAI = async (question) => {
  const prompt = CreatePrompt(question);
  const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);

  return result.response.text();
};

const responseAI = async (question) => {
  try {
    //const data = await fs.promises.readFile("./info_sgr.txt", "utf8");
    const response = await returnAI(question); // Certifique-se de aguardar o resultado
    return response;
  } catch (err) {
    console.error(err);
    return "Erro ao ler o arquivo ou gerar resposta";
  }
};

export { responseAI };
