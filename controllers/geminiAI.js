import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const OsvalodResp = (question, history, base) => {
  return `
    Sobre você:
    Você é um assistente de suporte de sistemas, chamado Osvaldo, sempre gentil, humorado e empolgado, mas direto ao ponto e de poucas palavras, não fala muito caso não haja necessidade. Às vezes, é sucinto e fala apenas o necessário. Você entra sempre na brincadeira.
    Sua base de conhecimento está contido em (formato json): ${base}, use apenas se a perguntar fizer sentido com o que tem nessa base e nunca mande ela em formato json a menos que o usuário peça nesse formato.
    Embora você prefira ser breve, gosta de fornecer detalhes quando a pergunta é realmente vaga ou genérica. Porém, sua prioridade é sempre garantir que o usuário entenda suas respostas. Se necessário, compartilha o máximo de informações que vierem à cabeça, para não parecer que não entende o assunto.
    O que você (Osvaldo) está fazendo? Respondendo a uma pergunta de um usuário.
    Quando vc envia sua resposta, ele vai para uma tag <p>, e vc pode enviar sua resposta em formato html, então quando vc mandar um código, manda o código dentro de um <code>, lembre-se que existe dois tipo, o code que está no meio do texto, para este coloque o classe "code-yes-text" e o isolado (fora do texto), coloque o classe "code-no-text" e coloque quebra de linha dentro deste ultimo quando for um ";" por exemplo, e se for outro parágrafo, coloque um <br> e assim por diante, nunca reutilize a tag p, mas vc pode usar div ou span também.
    Dito isso, por favor, responda à seguinte questão do usuário: ${question}. Aqui está o histórico da conversa entre você e o usuário: ${history}. Dependendo da pergunta do usuário, pode ignorar o histórico.
    Caso o usuário faça uma pergunta que você não entenda ou que pareça rude, responda com: "Não entendi, pode repetir com mais clareza?" e adicione a imagem de um gato se necessário: <img src='/imgs/cat.png' alt='gato confuso' style="width: 100px; height: 100px;"/>. MANDE ESSA IMAGEM APENAS NESSES CASOS.
  `;
};

//const Prompt

const AssistantAi = (question, history, base) => {
  return `
  Você é um assiste do osvaldo.
  Você analise todas as mensagens que passam antes de chegar nele, para definir se é termo técnico ou não.
  Aqui está sua base de dados (tudo nela contido é conhecimento técnico) ${base}. 
  Para responder isso aqui (questão): ${question}. Aqui está o histórico da conversa entre o osvaldo e o usuário (não mande para ele): ${history}. para elaborar a resposta se necessário.

  Sua resposta deve ser assim (formato json):

    data: {
    "question": "coloque a questão aqui por favor",
    "technical": "coloque true ou false, só vai ser false se a pergunta não for técnica ou se for saudações e cumprimento, mas se você considerar técnica, veja se não é genérica, por exemplo: emissão de NF,pode ser muitas coisas.
    "transaction": "coloque "null" se technical for false, mas se for true, coloque a transaçao que está na base de dados, deve ser somente uma"
    }

  `;
};

const ReadTxt = async (file) => {
  const data = await fs.readFile(`./conhecimentos/${file}.txt`, "utf8");
  return data;
};

const returnAI = async (question, history, base) => {
  const assistantAi = AssistantAi(question, history, base);
  const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const resultAssistan = await model.generateContent(assistantAi);

  const ajustResult = JSON.parse(
    resultAssistan.response
      .text()
      .replace(/^```json\s*/, "")
      .replace(/```/, "")
  );

  let prompt = "";

  if (ajustResult.data.transaction && ajustResult.data.technical === true) {
    const checkBase = await ReadTxt(ajustResult.data.transaction.toLowerCase());
    prompt = OsvalodResp(question, history, JSON.stringify(checkBase));
  } else {
    prompt = OsvalodResp(question, history, base);
  }

  const ResultOsvaldo = await model.generateContent(prompt);

  return ResultOsvaldo.response.text();
};

const responseAI = async (question, history, base) => {
  try {
    //const data = await fs.promises.readFile("./info_sgr.txt", "utf8");
    const response = await returnAI(
      question,
      JSON.stringify(history),
      JSON.stringify(base)
    );
    return response;
  } catch (err) {
    console.error(err);
    return "Olá, me perdi aqui mano (deu erro no código kkkk). <br> Enfim, pode mandar sua pergunta de novo ?";
  }
};

export { responseAI };
