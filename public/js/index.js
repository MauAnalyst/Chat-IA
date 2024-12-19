document.addEventListener("DOMContentLoaded", () => {
  const user_id = document.querySelector("#user-profile #user_id");
  const user_name = document.querySelector("#user-profile #user_name");

  //-------- navegando entre chats
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

  //-------- carregando imagem
  // Selecionando elementos
  const imageInput = document.getElementById("image");
  const previewContainer = document.getElementById("preview-image");
  const previewImage = document.querySelector("#preview-image img");
  const closeButton = document.getElementById("close");

  // Manipulador para exibir a imagem no preview
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0]; // Obtém o arquivo selecionado
    if (file) {
      const reader = new FileReader(); // Permite ler o conteúdo do arquivo
      reader.onload = function (event) {
        previewImage.src = event.target.result; // Define o src da imagem
        previewContainer.style.display = "block"; // Exibe o preview
      };
      reader.readAsDataURL(file); // Converte o arquivo em uma URL base64
    }
  });

  // Manipulador para fechar o preview
  closeButton.addEventListener("click", function () {
    previewImage.src = ""; // Remove a imagem do preview
    previewContainer.style.display = "none"; // Esconde o preview
    imageInput.value = ""; // Reseta o input de arquivo
  });

  //-------- exibindo outra conversa
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
              pQuestion.innerHTML = e.user_chat;

              divQuestion.appendChild(pQuestion);
              hystory.appendChild(divQuestion);

              //osvaldo
              const divResp = document.createElement("div");
              const pResp = document.createElement("div");

              divResp.id = "resp";
              pResp.id = "text-ai";
              divResp.className = "msgm-group";
              divResp.innerHTML = '<img src="/imgs/logo.png" alt="logo ia" />';
              pResp.innerHTML = e.osvaldo_chat;

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

  //-------- mandando msgm a osvaldo
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
    const userId = document.querySelector("#userId");
    const subject = document.querySelector("#subject");

    if (msgm === "" && imageInput.files.length === 0) {
      console.log("caiu aq?");
      return;
    }

    //dados do formulário
    const formData = new FormData();
    formData.append("subject", origin); // Adiciona o "subject"
    formData.append("message", msgm);
    formData.append("user_id", userId.value);

    //checkando se há imagem
    if (imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
      previewImage.alt = "preview-on";
    }

    //trantando input
    input.value = "";
    input.disabled = true;

    let imgElement = null;
    console.log(previewImage.alt);
    if (previewImage.alt === "preview-on") {
      imgElement = document.createElement("img");
      imgElement.src = previewImage.src;
      imgElement.alt = "imagem enviada";
    }

    previewImage.src = ""; // Remove a imagem do preview
    previewContainer.style.display = "none"; // Esconde o preview
    imageInput.value = "";

    //adicionando a msgm do usuário no histórico
    const divQuestion = document.createElement("div");
    const pQuestion = document.createElement("p");
    const spanMsgm = document.createElement("span");
    divQuestion.id = "perg";
    spanMsgm.textContent = msgm;
    divQuestion.className = "msgm-group";
    if (imgElement) {
      console.log("entrou aq", imgElement);
      pQuestion.appendChild(imgElement);
      pQuestion.appendChild(document.createElement("br"));
    }
    pQuestion.appendChild(spanMsgm);
    //pQuestion.innerHTML += `<br> ${msgm}`;
    divQuestion.appendChild(pQuestion);
    hystory.appendChild(divQuestion);

    //exibir carragamento
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML = load;
    hystory.appendChild(loading);

    //scroll ao add msg
    const scrollHeight = document.querySelector("#history").scrollHeight;
    historyChat.scrollTop = scrollHeight;

    const response = await fetch("/chats/send/message", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: formData,
      // body: JSON.stringify({
      //   subject: origin,
      //   message: msgm,
      //   user_id: user_id.textContent,
      // }),
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

    // Remover carregamento e reativar input
    document.querySelector("#loading").remove();
    previewImage.alt = "preview-off";
    input.disabled = false;
    input.focus();
  });

  //adicionando imagem com Ctrl + v
  input.addEventListener("paste", (event) => {
    const clipboardItems = event.clipboardData.items;

    for (const item of clipboardItems) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        // Atualiza o input file com a imagem colada
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        imageInput.files = dataTransfer.files;

        // Mostra a imagem no preview
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewContainer.style.display = "block";
        };
        reader.readAsDataURL(file);

        // Bloqueia o comportamento padrão
        event.preventDefault();
        break;
      }
    }
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

      document.querySelector("#history").innerHTML = "";
      scroll.style.display = "none";
      showMessage();

      const response = await fetch("/chats/send/delete-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          user_id,
        }),
      });

      const data = await response.json();

      // if (data) {
      //   if (data.resp === true) {
      //     scroll.style.display = "none";
      //     showMessage();
      //   }
      // }
    });
});

function showMessage() {
  const messageDelete = document.getElementById("message-delete");

  messageDelete.classList.add("show");

  setTimeout(() => {
    messageDelete.classList.add("hide");

    setTimeout(() => {
      messageDelete.classList.remove("show", "hide");
    }, 1500);
  }, 1500);
}
