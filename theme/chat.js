// IIFE to encapsulate our chat functionality and avoid polluting the global scope
(function () {
  // Configuration object
  // const CONFIG = {
  //   API_URL: "https://backend.agent.starknet.id/api",
  //   WS_URL: "wss://backend.agent.starknet.id/ws",
  //   MAX_RECONNECT_ATTEMPTS: 5,
  // };
  const CONFIG = {
    API_URL: "https://backend.agent.starknet.id/api",
    WS_URL: "wss://backend.agent.starknet.id/ws",
    MAX_RECONNECT_ATTEMPTS: 5,
  };

  // ChatManager class to handle chat logic
  class ChatManager {
    constructor() {
      this.chatSocket = null;
      this.currentChatId = null;
      this.reconnectAttempts = 0;
      this.currentMessageId = null;
      this.currentSources = [];
      this.currentMessageContent = "";
      this.messageHistory = [];
      this.chatId = this.generateUniqueId(); // Generate a unique chat ID for this session

      this.initializeDOMElements();
      this.attachEventListeners();
      this.fetchModels().then(() => this.initializeChat());
      this.toggleChatButton(true);
    }

    initializeDOMElements() {
      this.chatButton = this.createChatButton();
      this.chatWindow = this.createChatWindow();
      this.statusElement = this.createStatusElement();
      document.body.appendChild(this.chatButton);
      document.body.appendChild(this.chatWindow);
      document.body.appendChild(this.statusElement);
    }

    createChatButton() {
      const button = document.createElement("div");
      button.id = "chat-button";
      button.innerHTML = "💬";
      button.style.position = "fixed";
      button.style.bottom = "20px";
      button.style.right = "20px";
      button.style.width = "50px";
      button.style.height = "50px";
      button.style.backgroundColor = "var(--links)";
      button.style.color = "var(--bg)";
      button.style.borderRadius = "50%";
      button.style.display = "flex";
      button.style.justifyContent = "center";
      button.style.alignItems = "center";
      button.style.cursor = "pointer";
      button.style.fontSize = "24px";
      button.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      button.style.zIndex = "1000";
      return button;
    }

    createChatWindow() {
      const window = document.createElement("div");
      window.id = "chat-window";
      window.style.display = "none";
      window.innerHTML = `
        <div id="chat-header">
          <span>Chat</span>
          <button id="close-chat">×</button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input">
          <input type="text" id="message-input" placeholder="Ask anything about Cairo...">
          <button id="send-message">Send</button>
        </div>
      `;
      return window;
    }

    createStatusElement() {
      const status = document.createElement("div");
      status.id = "connection-status";
      status.className = "disconnected";
      status.textContent = "Disconnected";
      return status;
    }

    attachEventListeners() {
      this.chatButton.addEventListener("click", () => this.toggleChatWindow());
      document
        .getElementById("close-chat")
        .addEventListener("click", () => this.closeChatWindow());
      document
        .getElementById("send-message")
        .addEventListener("click", () => this.sendMessage());
      document
        .getElementById("message-input")
        .addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.sendMessage();
        });
    }

    async fetchModels() {
      try {
        const response = await fetch(CONFIG.API_URL + "/models");
        return await response.json();
      } catch (error) {
        console.error("Error fetching models:", error);
        this.showToast(
          "Failed to fetch models. Please try again later.",
          "error",
        );
      }
    }

    initializeChat() {
      this.messageHistory = [];
      this.chatId = this.generateUniqueId();
      this.connectWebSocket();
    }

    connectWebSocket() {
      const wsURL = new URL(CONFIG.WS_URL);
      const searchParams = new URLSearchParams({
        chatModel: "Claude 3.5 Sonnet",
        chatModelProvider: "anthropic",
        embeddingModel: "Text embedding 3 large",
        embeddingModelProvider: "openai",
      });
      wsURL.search = searchParams.toString();

      this.chatSocket = new WebSocket(wsURL.toString());
      this.setupWebSocketHandlers();
    }

    setupWebSocketHandlers() {
      this.chatSocket.onopen = () => this.handleWebSocketOpen();
      this.chatSocket.onclose = () => this.handleWebSocketClose();
      this.chatSocket.onerror = (error) => this.handleWebSocketError(error);
      this.chatSocket.onmessage = (event) => this.handleWebSocketMessage(event);
    }

    handleWebSocketOpen() {
      console.log("[DEBUG] WebSocket connection opened");
      this.setWSReady(true);
      this.reconnectAttempts = 0;
    }

    handleWebSocketClose() {
      console.log("[DEBUG] WebSocket connection closed");
      this.setWSReady(false);
      this.attemptReconnect();
    }

    handleWebSocketError(error) {
      console.error("WebSocket error:", error);
    }

    handleWebSocketMessage(event) {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);

        if (data.type === "error") {
          console.error("Received error message:", data.data);
          this.showToast(data.data, "error");
          this.removeLoadingIndicator();
          return;
        }

        if (data.type === "sources") {
          console.log("Received sources:", data.data);
          this.currentSources = data.data;
          this.currentMessageId = data.messageId;
        }

        if (data.type === "message") {
          if (this.currentMessageId !== data.messageId) {
            this.currentMessageId = data.messageId;
            this.currentMessageContent = "";
            this.appendStreamingMessage(this.currentMessageId);
          }
          this.currentMessageContent += data.data;
          this.updateStreamingMessage(
            this.currentMessageId,
            this.currentMessageContent,
            this.currentSources,
          );
        }

        if (data.type === "messageEnd") {
          console.log("Message end received");
          this.removeLoadingIndicator();
          // Update the existing message instead of appending a new one
          this.updateStreamingMessage(
            this.currentMessageId,
            this.currentMessageContent,
            this.currentSources,
          );
          // Add the final message to the history
          this.messageHistory.push(["ai", this.currentMessageContent]);
          // Limit history to last 10 messages (adjust as needed)
          if (this.messageHistory.length > 10) {
            this.messageHistory.shift();
          }
          this.currentSources = [];
          this.currentMessageId = null;
          this.currentMessageContent = "";
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        console.error("Raw message data:", event.data);
      }
    }

    appendMessage(role, content, messageId = null) {
      const chatMessages = document.getElementById("chat-messages");
      if (!chatMessages) {
        console.error("Chat messages container not found");
        return;
      }

      const messageElement = document.createElement("div");
      messageElement.className = `message ${role}`;
      if (messageId) {
        messageElement.id = `message-${messageId}`;
      }

      const contentElement = document.createElement("div");
      contentElement.className = "content";
      contentElement.innerHTML = this.processMarkdown(content);
      messageElement.appendChild(contentElement);

      chatMessages.appendChild(messageElement);
      this.scrollToBottom();

      // Add message to history
      this.messageHistory.push([role === "user" ? "human" : "ai", content]);

      // Limit history to last 10 messages (adjust as needed)
      if (this.messageHistory.length > 10) {
        this.messageHistory.shift();
      }
    }

    appendStreamingMessage(messageId) {
      const chatMessages = document.getElementById("chat-messages");
      if (!chatMessages) {
        console.error("Chat messages container not found");
        return null;
      }

      const messageElement = document.createElement("div");
      messageElement.className = "message ai streaming";
      messageElement.id = `message-${messageId}`;

      const contentElement = document.createElement("div");
      contentElement.className = "content";
      messageElement.appendChild(contentElement);

      chatMessages.appendChild(messageElement);
      this.scrollToBottom();

      return messageElement;
    }

    updateStreamingMessage(messageId, content, sources) {
      let messageElement = document.getElementById(`message-${messageId}`);
      if (!messageElement) {
        console.log(
          `Creating new message element for ID: message-${messageId}`,
        );
        messageElement = this.appendStreamingMessage(messageId);
      }

      const contentElement = messageElement.querySelector(".content");
      if (contentElement) {
        const processedContent = this.processMarkdown(content, sources);
        contentElement.innerHTML = processedContent;
        this.highlightCodeBlocks();
        this.scrollToBottom();
      } else {
        console.error(`Content element not found in message-${messageId}`);
      }
    }

    showLoadingIndicator() {
      const loadingElement = document.createElement("div");
      loadingElement.className = "message loading";
      loadingElement.textContent = "AI is thinking...";
      document.getElementById("chat-messages").appendChild(loadingElement);
      this.scrollToBottom();
    }

    removeLoadingIndicator() {
      const loadingElement = document.querySelector(".message.loading");
      if (loadingElement) {
        loadingElement.remove();
      }
    }

    scrollToBottom() {
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    setWSReady(isReady) {
      const statusElement = document.getElementById("connection-status");
      if (statusElement) {
        statusElement.textContent = isReady ? "Connected" : "Disconnected";
        statusElement.className = isReady ? "connected" : "disconnected";
      }
    }

    showToast(message, type) {
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    processMarkdown(content, sources = []) {
      // Simple markdown processing (you might want to use a proper markdown library for more complex cases)
      let processedContent = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(\d+)\]/g, (match, p1) => {
          const sourceIndex = parseInt(p1) - 1;
          if (
            sources[sourceIndex] &&
            sources[sourceIndex].metadata &&
            sources[sourceIndex].metadata.url
          ) {
            return `<a href="${sources[sourceIndex].metadata.url}" target="_blank">[${p1}]</a>`;
          }
          return match;
        });

      // Process code blocks
      processedContent = processedContent.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, language, code) => {
          return `<pre><code class="language-${language || "plaintext"}">${this.escapeHtml(code.trim())}</code></pre>`;
        },
      );

      // Add formatted sources at the end
      if (sources && sources.length > 0) {
        const formattedSources = sources
          .map(
            (source, i) =>
              `[${i + 1}] <a href="${source.metadata.url}" target="_blank">${source.metadata.title || "Untitled"}</a>`,
          )
          .join("\n");
        processedContent += `\n\nRelevant pages:\n${formattedSources}`;
      }

      return processedContent;
    }

    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    highlightCodeBlocks() {
      // Assuming you're using a syntax highlighting library like Prism.js
      if (window.Prism) {
        Prism.highlightAll();
      }
    }

    toggleChatButton(show) {
      if (this.chatButton) {
        this.chatButton.style.display = show ? "flex" : "none";
      }
    }

    toggleChatWindow() {
      const isVisible = this.chatWindow.style.display === "flex";
      this.chatWindow.style.display = isVisible ? "none" : "flex";
      document.body.classList.toggle("chat-open", !isVisible);
      this.toggleChatButton(isVisible);
    }

    closeChatWindow() {
      this.chatWindow.style.display = "none";
      document.body.classList.remove("chat-open");
      this.toggleChatButton(true);
      this.clearChatHistory(); // Clear history when closing the chat window
    }

    sendMessage() {
      const input = document.getElementById("message-input");
      const message = input.value.trim();
      if (message && this.chatSocket.readyState === WebSocket.OPEN) {
        input.value = "";
        this.sendMessageToServer(message);
        this.showLoadingIndicator();
      } else if (this.chatSocket.readyState !== WebSocket.OPEN) {
        this.showToast(
          "Not connected to the chat server. Please try again later.",
          "error",
        );
      }
    }

    sendMessageToServer(message) {
      const messageId = this.generateUniqueId();
      const messageData = {
        type: "message",
        message: {
          messageId: messageId,
          chatId: this.chatId,
          content: message,
        },
        copilot: false,
        focusMode: "succintCairoBookSearch",
        history: this.messageHistory,
      };
      this.chatSocket.send(JSON.stringify(messageData));

      // Immediately append the user's message
      this.appendMessage("user", message, messageId);
    }

    attemptReconnect() {
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= CONFIG.MAX_RECONNECT_ATTEMPTS) {
        this.showToast(
          "Connection lost. Attempting to reconnect...",
          "warning",
        );
        console.log(`[DEBUG] reconnect attempt ${this.reconnectAttempts}`);
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        setTimeout(() => this.connectWebSocket(), delay);
      } else {
        this.showToast(
          "Failed to connect after multiple attempts. Please try again later.",
          "error",
        );
      }
    }

    clearChatHistory() {
      this.messageHistory = [];
      // Clear the chat messages from the DOM
      const chatMessages = document.getElementById("chat-messages");
      if (chatMessages) {
        chatMessages.innerHTML = "";
      }
      // Generate a new chat ID for the next conversation
      this.chatId = this.generateUniqueId();
    }
  }

  // Initialize the chat manager when the DOM is ready
  document.addEventListener("DOMContentLoaded", () => new ChatManager());
})();
