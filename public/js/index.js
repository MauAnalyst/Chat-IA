document.addEventListener("DOMContentLoaded", () => {
  const user_id = document.querySelector("#user-profile #user_id");
  const user_name = document.querySelector("#user-profile #user_name");

  //navegando entre chats
  const titleContent = document.querySelector(".content .title span");
  const titleChats = document.querySelectorAll(".chats .chat-group h3");
  const chatsGroup = document.querySelectorAll(".chats .chat-group");

  titleChats.forEach((e, i) => {
    if (
      e.textContent.toUpperCase() === titleContent.textContent.toUpperCase()
    ) {
      chatsGroup[i].style.backgroundColor = "var(--color5)";
    }
  });

  chatsGroup.forEach((e, i) => {
    e.addEventListener("click", () => {
      chatsGroup.forEach((e) => {
        e.style.backgroundColor = "transparent";
      });

      localStorage.clear();
      document.querySelector("#history").innerHTML = "";
      chatsGroup[i].style.backgroundColor = "var(--color5)";

      const chatTitle = titleChats[i].textContent.toLowerCase();
      fetch(`/chats/c/${chatTitle}/${user_id.textContent}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          history.pushState(
            null,
            "",
            `/chats/${chatTitle}/${user_id.textContent}`
          );

          document.querySelector(".content .title").innerHTML = data.content;
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    });
  });

  //Comunicação com a IA
  const hystory = document.querySelector("#history");
  const send = document.querySelector("#to-send");
  const input = document.querySelector("#user_input");
  const load = `
   <img src="/imgs/logo.png" alt="logo ia" />
    <section class="dots-container">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </section>
  `;

  const loadHistory = () => {
    const storedHistory = localStorage.getItem("chatHistory");
    const history = storedHistory ? JSON.parse(storedHistory) : {};

    return {
      user: Array.isArray(history.user) ? history.user : [],
      osvaldo: Array.isArray(history.osvaldo) ? history.osvaldo : [],
    };
  };

  const saveHistory = (history) => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };

  send.addEventListener("click", async (e) => {
    e.preventDefault();

    const origin = document.querySelector(".content .title span").textContent;
    const msgm = input.value;

    //trantando input
    input.value = "";
    input.disabled = true;

    //adicionando a msgm do usuário no histórico
    const divQuestion = document.createElement("div");
    const pQuestion = document.createElement("p");

    divQuestion.id = "perg";
    divQuestion.className = "msgm-group";
    pQuestion.textContent = msgm;

    divQuestion.appendChild(pQuestion);
    hystory.appendChild(divQuestion);

    //exibir carragamento
    const loading = document.createElement("div");

    loading.id = "loading";
    loading.innerHTML = load;

    hystory.appendChild(loading);

    // Atualizar histórico no localStorage
    const historyLocal = loadHistory();
    historyLocal.user.push(msgm);
    if (historyLocal.user.length > 10) historyLocal.user.shift();
    saveHistory(historyLocal);

    const response = await fetch("/chats/send/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: origin,
        message: msgm,
        history: getHistory(),
        user: user_name.textContent,
      }),
    });

    const data = await response.json();

    historyLocal.osvaldo.push(data.resp);
    if (historyLocal.osvaldo.length > 10) historyLocal.osvaldo.shift(); // Limitar a 5 mensagens
    saveHistory(historyLocal);

    //adicionando a resposta da gemini AI no histórico
    const divResp = document.createElement("div");
    const pResp = document.createElement("p");

    divResp.id = "resp";
    divResp.className = "msgm-group";
    divResp.innerHTML = '<img src="/imgs/logo.png" alt="logo ia" />';
    pResp.innerHTML = data.resp; //formatText(data.resp);

    divResp.appendChild(pResp);
    hystory.appendChild(divResp);

    // Remover carregamento e reativar input
    document.querySelector("#loading").remove();
    input.disabled = false;
    input.focus();
  });

  const getHistory = () => {
    const history = loadHistory(); // Reutiliza a função que já criamos
    return history; // Retorna o objeto { user: [...], ia: [...] }
  };

  function formatText(text) {
    // Formata blocos de texto com explicações e quebra de linhas
    let formattedText = text
      .replace(/\n\*{4}(.*?)\*{4}\n/g, "\n\n**$1:**\n") // Negrito para seções importantes
      .replace(/```javascript([\s\S]*?)```/g, "\n\n```javascript\n$1\n```\n") // Mantém blocos de código
      .replace(/-\s\*\*(.*?)\*\*/g, "\n- **$1**") // Ajusta marcadores com negrito
      .replace(/\*\*(.*?)\*\*/g, "**$1**") // Garante negrito para trechos destacados
      .replace(/(\*{2}[A-Z].*?:\*{2})/g, "\n\n$1"); // Adiciona espaçamento antes de títulos

    return formattedText;
  }
});

// const history = document.getElementById("history");

// history.addEventListener("scroll", () => {
//   const scrollTop = history.scrollTop; // Posição de rolagem atual do topo
//   const scrollHeight = history.scrollHeight; // Altura total do conteúdo
//   const clientHeight = history.clientHeight; // Altura visível do elemento

//   // Verifica se está no final (ou próximo ao final)
//   if (scrollTop + clientHeight >= scrollHeight - 10) {
//     console.log("Chegou ao final do scroll");
//   } else {
//     console.log("Ainda não está no final");
//   }
// });

//localStorage.clear();
