document.addEventListener("DOMContentLoaded", () => {
  const user_id = document.querySelector("#user-profile #user_id");
  const user_name = document.querySelector("#user-profile #user_name");

  //navegando entre chats
  const titleContent = document.querySelector(".content .title span");
  const titleChats = document.querySelectorAll(".chats .chat-group h3");
  const chatsGroup = document.querySelectorAll(".chats .chat-group");

  const historyChat = document.getElementById("history");
  const scroll = document.querySelector("#scroll-history");
  const buttonScroll = document.querySelector(
    "#scroll-history .material-symbols-outlined"
  );

  const checkScrollPosition = () => {
    const scrollTop = document.getElementById("history").scrollTop;
    const scrollHeight = document.getElementById("history").scrollHeight;
    const clientHeight = document.getElementById("history").clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      scroll.style.display = "none";
    } else {
      scroll.style.display = "flex";
    }
  };

  checkScrollPosition();

  historyChat.addEventListener("scroll", checkScrollPosition);

  buttonScroll.addEventListener("click", () => {
    historyChat.scrollTop = historyChat.scrollHeight;
  });

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

      scroll.style.display = "none";

      chatsGroup[i].style.backgroundColor = "var(--color5)";
      document.querySelector("#loading-chat").style.display = "flex";

      //limpando a tela e add loading
      document.querySelector("#history").innerHTML = "";
      document.querySelector(".content .title").innerHTML = "";
      document.querySelector("#msg-user").style.display = "none";
      document.querySelector(".warning").style.display = "none";

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

          document.querySelector("#loading-chat").style.display = "none";

          document.title = `Suporte IA | ${data.title}`;
          document.querySelector(".content .title").innerHTML = data.content;
          document.querySelector("#msg-user").style.display = "flex";
          document.querySelector(".warning").style.display = "block";

          //add histórico
          if (data.chats) {
            data.chats.forEach((e) => {
              //usuário
              const divQuestion = document.createElement("div");
              const pQuestion = document.createElement("p");

              divQuestion.id = "perg";
              divQuestion.className = "msgm-group";
              pQuestion.textContent = e.user_chat;

              divQuestion.appendChild(pQuestion);
              hystory.appendChild(divQuestion);

              //osvaldo
              const divResp = document.createElement("div");
              const pResp = document.createElement("div");

              divResp.id = "resp";
              pResp.id = "text-ai";
              divResp.className = "msgm-group";
              divResp.innerHTML = '<img src="/imgs/logo.png" alt="logo ia" />';
              pResp.innerHTML = e.osvaldo_chat; //formatText(data.resp);

              divResp.appendChild(pResp);
              hystory.appendChild(divResp);
            });

            checkScrollPosition();
          }
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

  send.addEventListener("click", async (e) => {
    e.preventDefault();

    const origin = document.querySelector(".content .title span").textContent;
    const msgm = input.value;

    if (msgm === "") {
      return;
    }

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

    //scroll ao add msg
    const scrollHeight = document.querySelector("#history").scrollHeight;
    const clientHeight = document.querySelector("#history").clientHeight;

    // if (scrollHeight > clientHeight) {
    //   scroll.style.display = "flex";
    // }

    historyChat.scrollTop = scrollHeight;

    const response = await fetch("/chats/send/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: origin,
        message: msgm,
        user_id: user_id.textContent,
      }),
    });

    const data = await response.json();

    //adicionando a resposta da gemini AI no histórico
    const divResp = document.createElement("div");
    const pResp = document.createElement("div");

    divResp.id = "resp";
    pResp.id = "text-ai";
    divResp.className = "msgm-group";
    divResp.innerHTML = '<img src="/imgs/logo.png" alt="logo ia" />';
    pResp.innerHTML = data.resp; //formatText(data.resp);

    divResp.appendChild(pResp);
    hystory.appendChild(divResp);

    //checkScrollPosition();

    // Remover carregamento e reativar input
    document.querySelector("#loading").remove();
    input.disabled = false;
    input.focus();
  });

  //deletando histórico
  document
    .querySelector("#user-profile .material-symbols-outlined")
    .addEventListener("click", async () => {
      const subject = document.querySelector(
        ".content .title span"
      ).textContent;
      const user_id = document.querySelector(
        "#user-profile #user_id"
      ).textContent;

      const response = await fetch("/chats/delete-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          user_id,
        }),
      });

      document.querySelector("#history").innerHTML = "";

      const data = await response.json();

      if (data) {
        if (data.resp === true) {
          scroll.style.display = "none";
          showMessage();
        }
      }
    });
});

function showMessage() {
  const messageDelete = document.getElementById("message-delete");

  // Adiciona a classe para mostrar a mensagem
  messageDelete.classList.add("show");

  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    messageDelete.classList.add("hide");

    // Remove o elemento completamente após a animação
    setTimeout(() => {
      messageDelete.classList.remove("show", "hide");
    }, 1500); // Tempo para o fade-out terminar
  }, 1500); // Tempo que a mensagem fica visível
}

// Chame a função para exibir a mensagem
