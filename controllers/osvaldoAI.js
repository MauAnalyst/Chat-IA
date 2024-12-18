import { GoogleGenerativeAI } from "@google/generative-ai";
import stringSimilarity from "string-similarity";
import fs from "fs/promises";
//import fs from "fs";
import mammoth from "mammoth";
import dotenv from "dotenv";

dotenv.config();

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//personalidade do osvaldo
const persOslvado = `
  Sobre você:

    Você é um assistente de suporte de sistemas chamado Osvaldo. Trabalha com sistemas SAP e PL/SQL. Sua personalidade é gentil, bem-humorada e direta ao ponto, preferindo respostas curtas e objetivas, mas claras e relevantes. Você é flexível e entra nas brincadeiras quando apropriado, mas evita falar além do necessário.

    Sua tarefa:
    - Responder a perguntas de usuários.
    - Caso a pergunta seja sobre um erro, forneça a solução de forma objetiva, detalhando apenas se solicitado pelo usuário.
    - Seja sempre claro em sua explicação, destacando apenas os detalhes que realmente importam.

    Sobre o formato de resposta:
    - Você deve utilizar tags HTML em suas respostas.
    - Quando enviar códigos:
      1. Se o código estiver no meio do texto, use a tag <code> com a classe "code-yes-text".
      2. Se o código for isolado (fora do texto), use a tag <code> com a classe "code-no-text" e:
         - Insira quebras de linha (<br>) quando houver um ";" ou para separar parágrafos.
         - Não reutilize a tag <p>, mas pode usar <div> ou <span> conforme necessário.
  `;

//resposta geral
const GeralResp = (question, history, base) => {
  return `
    Sobre você:
    ${persOslvado}
    Sua base de conhecimento está contido em (formato json): ${base}, use apenas se a perguntar fizer sentido com o que tem nessa base e nunca mande ela em formato json a menos que o usuário peça nesse formato.
    Dito isso, por favor, responda à seguinte questão do usuário: ${question} (não repita ela para o usuário). Aqui está o histórico da conversa entre você e o usuário: ${history}. Dependendo da pergunta do usuário, pode ignorar o histórico.
  `;
};

const ReadTxt = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");

    return data;
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
    return null;
  }
};

const returnAI = async (subject, question, history, base) => {
  const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let resp = "";
  if (subject === "geral" || subject === "chamados") {
    const prompt = GeralResp(
      question,
      JSON.stringify(history),
      JSON.stringify(base)
    );
    resp = await model.generateContent(prompt);
  } else if (subject === "erros") {
    //procurando o melhor resultado para definir a base
    const erros = base.map((item) => item.erro);
    const matchErros = stringSimilarity.findBestMatch(question, erros).ratings;

    let result = matchErros.filter((item) => item.rating.toFixed(2) >= 0.3);

    if (result.length > 0) {
      result = base.filter((item) => item.erro === result[0].target);
    }

    if (result.length === 0) {
      //se não encontrar pelo erro, procura pela transação
      const transErro = base.map((item) => item.transacao.toLowerCase());
      const matchTrans = stringSimilarity.findBestMatch(
        question.toLowerCase(),
        transErro
      ).ratings;

      let transaction = matchTrans
        .filter((item) => item.rating >= 0.3)
        .map((item) => item.target)[0];

      let data =
        matchTrans.rating !== 0
          ? base.filter((item) => item.transacao.toLowerCase() === transaction)
          : [];

      result = base.filter((item) => item.erro === data.target);
    }

    //caso ainda não ache, procura pelo histórico
    if (history !== null && result.length === 0) {
      let checkErro = "";
      let dataUser = [];

      history.forEach((e) => {
        let check = stringSimilarity.findBestMatch(
          e.user_chat,
          erros
        ).bestMatch;

        if (check && check.rating >= 0.3) {
          dataUser.push(check.target);
        }
      });

      if (dataUser.length > 0) {
        checkErro = base.filter(
          (item) => item.erro === dataUser[dataUser.length - 1]
        )[0];
        result = [checkErro];
      }
    }

    //enviando para a ia
    if (result.length === 0 || result.length > 1) {
      resp = await model.generateContent(`
        Sobre você:
        ${persOslvado}

        Sua base de conhecimento é: "${JSON.stringify(
          base
        )}". nunca coloque essa base "crua" na sua resposta.

        Caso o erro ou transação não estiver na base, diga que o erro não foi documentado.

        Dito isso, responda a questão: "${question}". utilize o historico da conversa "${JSON.stringify(
        history
      )}" caso a pergunta for sem sentido sozinha.
        `);
    } else if (result.length === 1) {
      //procurando documentação
      let documentation = await ReadTxt(
        `./conhecimentos/erros/${result[0].id}.txt`
      );
      resp = await model.generateContent(`
        Sobre você:
        ${persOslvado}

        Sua base de conhecimento é: "${JSON.stringify(documentation)}". 
        Se possível tente resolver para o usuário se tiver todas as informações

        Caso a base acima esteja vazio, considere esta outra: ${JSON.stringify(
          base
        )}, e fale para o usuário que você não possui mais detalhes pois não foi documentado.

        Tente ajudar o usuário, se necessário vc pede informações (igual na base) para você mesmo resolver.

        utilize o historico da conversa (ocorrendo nesse momento) "${JSON.stringify(
          history
        )}" para se ajudar na sua resposta. analise este principalmente a última msgm de vcs dois, pois a questão abaixo pode não fazer sentido por si só.

        Dito isso, responda a questão: "${question}". 
        `);
    }
  } else {
    let result = [];
    const transactions = base.map((item) => item.transacao.toLowerCase());
    const text = base.map((item) => item.texto.toLowerCase());

    let matchTrans = stringSimilarity.findBestMatch(
      question.toLowerCase(),
      transactions
    ).ratings;
    let matchText = stringSimilarity.findBestMatch(
      question.toLowerCase(),
      text
    ).ratings;

    //procura pela transação
    let checkTrans = matchTrans.filter((item) => item.rating >= 0.4);
    //result = base.filter(item => item.)
    console.log(checkTrans);

    resp = await model.generateContent(`
      Sobre você:
      ${persOslvado}

      Sua base de conhecimento está aqui: ${JSON.stringify(base)}, 

      utilize o historico da conversa (ocorrendo nesse momento) "${JSON.stringify(
        history
      )}" para ajudar na sua resposta. analise este principalmente a última msgm de vcs dois, pois a questão abaixo pode não fazer sentido por si só.

      Dito isso, responda a questão: "${question}". 
      `);
  }

  return resp.response.text();
};

const responseAI = async (subject, question, history, base) => {
  try {
    const response = await returnAI(subject, question, history, base);
    return response;
  } catch (err) {
    console.error(err);
    return "Me perdi aqui mano (deu erro no código kkkk). <br> Enfim, pode mandar sua pergunta de novo ?";
  }
};

export { responseAI };
