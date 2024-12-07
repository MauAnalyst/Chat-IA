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

  //enviando msgm para a IA
  const input = document.querySelector("#user_input");

  input.addEventListener("click", (e) => {
    e.defaultPrevented();

    const formData = new FormData(form);

    fetch("/chats/env-resp", {
      method: "POST",
      body: formData,
    });
  });
});
