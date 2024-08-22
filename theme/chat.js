document.addEventListener("DOMContentLoaded", function () {
  const chatButton = document.createElement("div");
  chatButton.id = "chat-button";
  chatButton.innerHTML = "💬";
  document.body.appendChild(chatButton);

  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.style.display = "none";
  chatWindow.innerHTML = `
      <div id="chat-header">
        <span>Chat</span>
        <button id="close-chat">×</button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input">
        <input type="text" id="message-input" placeholder="Ask the Cairo Bot...">
        <button id="send-message">Send</button>
      </div>
    `;
  document.body.appendChild(chatWindow);

  // Toggle chat window
  chatButton.addEventListener("click", function () {
    chatWindow.style.display =
      chatWindow.style.display === "none" ? "block" : "none";
  });

  // Close chat window
  document.getElementById("close-chat").addEventListener("click", function () {
    chatWindow.style.display = "none";
  });

  // Send message on enter / click
  document
    .getElementById("send-message")
    .addEventListener("click", sendMessage);
  document
    .getElementById("message-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });

  function sendMessage() {
    const input = document.getElementById("message-input");
    const message = input.value.trim();
    if (message) {
      const messageElement = document.createElement("div");
      messageElement.className = "message";
      messageElement.textContent = message;
      document.getElementById("chat-messages").appendChild(messageElement);
      input.value = "";
      //TODO add communication with Cairo Bot
    }
  }
});
