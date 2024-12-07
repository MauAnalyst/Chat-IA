document.addEventListener("DOMContentLoaded", () => {
  //navegando entre chates
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
      chatsGroup[i].style.backgroundColor = "var(--color5)";
      const chatTitle = titleChats[i].textContent.toLowerCase();
      fetch(`/chats/c/${chatTitle}`, {
        method: "GET",
        // params: chatTitle,
      })
        .then((response) => response.json())
        .then((data) => {
          history.pushState(null, "", `/chats/${chatTitle}`);

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

    //loading para esperar a resposta do gemini AI
    const loading = document.createElement("div");

    loading.id = "loading";
    loading.innerHTML = load;

    hystory.appendChild(loading);

    const response = await fetch("/chats/send/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: origin,
        message: msgm,
      }),
    });

    const data = await response.json();

    //adicionando a resposta da gemini AI no histórico
    const divResp = document.createElement("div");
    const pResp = document.createElement("p");

    divResp.id = "resp";
    divResp.className = "msgm-group";
    divResp.innerHTML = '<img src="/imgs/logo.png" alt="logo ia" />';
    pResp.textContent = data.resp;

    divResp.appendChild(pResp);
    hystory.appendChild(divResp);

    document.querySelector("#loading").remove();
    input.disabled = false;
    console.log(data.resp);
  });
});
