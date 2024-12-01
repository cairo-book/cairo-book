/**
 * Chat Window for mdBook Integration
 *
 * This script implements a chat window that integrates with mdBook documentation.
 * It provides an interactive AI-powered assistant to help users with questions
 * about the documentation content.
 *
 * Integration with mdBook:
 * - The chat window is dynamically injected into the mdBook page.
 * - It appears as a floating chat button in the bottom-right corner of the page.
 * - When clicked, it expands into a full chat interface.
 *
 * Main Features:
 * 1. Real-time chat with an AI assistant
 * 2. Persistent chat history across page navigation
 * 3. Markdown rendering for chat messages
 * 4. Code syntax highlighting
 * 5. Ability to clear chat history
 * 6. Automatic reconnection on connection loss
 *
 * WebSocket Communication:
 * - The chat connects to an LLM (Language Model) backend via WebSocket.
 * - It handles different message types from the server:
 *   a. 'error': Displays error messages to the user
 *   b. 'sources': Receives and stores relevant documentation sources
 *   c. 'message': Receives and displays AI responses in real-time
 *   d. 'messageEnd': Finalizes the AI response and updates the chat history
 *
 * The ChatManager class encapsulates all the functionality for the chat window,
 * including UI creation, WebSocket handling, and chat history management.
 */

// IIFE to encapsulate our chat functionality and avoid polluting the global scope
(function () {
  /**
   * Configuration object for the chat window.
   * @typedef {Object} ChatConfig
   * @property {string} API_URL - The base URL for API requests.
   * @property {string} WS_URL - The WebSocket URL for real-time communication.
   * @property {number} MAX_RECONNECT_ATTEMPTS - Maximum number of reconnection attempts.
   * @property {number} MAX_HISTORY_LENGTH - Maximum number of messages to keep in history.
   */
  const CONFIG = {
    API_URL: "https://backend.agent.starknet.id/api",
    WS_URL: "wss://backend.agent.starknet.id/ws",
    MAX_RECONNECT_ATTEMPTS: 5,
    MAX_HISTORY_LENGTH: 10,
  };

  class ChatManager {
    constructor() {
      /**
       * @type {WebSocket|null} The WebSocket connection to the chat server.
       */
      this.chatSocket = null;

      /**
       * @type {string} Unique identifier for the current chat session.
       */
      this.chatId = this.generateUniqueId();

      /**
       * @type {number} Number of reconnection attempts made.
       */
      this.reconnectAttempts = 0;

      /**
       * @type {string|null} ID of the current message being processed.
       */
      this.currentMessageId = null;

      /**
       * @type {Array} Array of source objects for the current message.
       */
      this.currentSources = [];

      /**
       * @type {string} Content of the current message being streamed.
       */
      this.currentMessageContent = "";

      /**
       * @type {Array<Array<string>>} Array of [role, content] pairs representing the chat history.
       */
      this.messageHistory = [];

      this.initializeDOMElements();
      this.attachEventListeners();
      this.loadChatHistory();
      this.initializeChat();
    }

    /**
     * Initializes DOM elements for the chat window.
     * This method creates and appends the chat button, chat window, and status element to the document body.
     */
    initializeDOMElements() {
      this.chatButton = this.createChatButton();
      this.chatWindow = this.createChatWindow();
      document.body.appendChild(this.chatButton);
      document.body.appendChild(this.chatWindow);
    }

    createChatButton() {
      const button = document.createElement("div");
      button.id = "chat-button";
      button.innerHTML = "💬";
      Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "50px",
        height: "50px",
        backgroundColor: "var(--links)",
        color: "var(--bg)",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        fontSize: "24px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: "1000",
      });
      return button;
    }

    createChatWindow() {
      const window = document.createElement("div");
      window.id = "chat-window";
      window.style.display = "none";
      window.innerHTML = `
        <div id="chat-header">
          <span id="connection-status" class="disconnected">Disconnected</span>
          <span class="chat-title">Chat</span>
          <button id="clear-history" class="icon-button" title="Clear History">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </button>
          <button id="close-chat">×</button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input">
          <input type="text" id="message-input" placeholder="Ask anything about Cairo...">
          <button id="send-message">Send</button>
        </div>
        <div id="chat-toasts"></div>
      `;
      return window;
    }

    /**
     * Attaches event listeners to various chat window elements.
     * This includes listeners for opening/closing the chat, sending messages, and clearing history.
     */
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
      document
        .getElementById("clear-history")
        .addEventListener("click", () => this.clearChatHistory());
    }

    /**
     * Initializes the chat by fetching models and connecting to WebSocket.
     * @async
     */
    async initializeChat() {
      try {
        await this.fetchModels();
        this.connectWebSocket();
      } catch (error) {
        console.error("Error initializing chat:", error);
        this.showToast(
          "Failed to initialize chat. Please try again later.",
          "error",
        );
      }
    }

    /**
     * Fetches available language models from the server.
     * @async
     * @returns {Promise<Object>} A promise that resolves to the available models.
     */
    async fetchModels() {
      try {
        const response = await fetch(`${CONFIG.API_URL}/models`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching models:", error);
        this.showToast(
          "Failed to fetch models. Please try again later.",
          "error",
        );
      }
    }

    /**
     * Establishes a WebSocket connection with the chat server.
     * The connection URL includes query parameters for specifying the chat and embedding models.
     */
    connectWebSocket() {
      const wsURL = new URL(CONFIG.WS_URL);
      wsURL.search = new URLSearchParams({
        chatModel: "Claude 3.5 Sonnet",
        chatModelProvider: "anthropic",
        embeddingModel: "Text embedding 3 large",
        embeddingModelProvider: "openai",
      }).toString();

      this.chatSocket = new WebSocket(wsURL.toString());
      this.setupWebSocketHandlers();
    }

    /**
     * Sets up WebSocket event handlers for open, close, error, and message events.
     */
    setupWebSocketHandlers() {
      this.chatSocket.onopen = () => this.handleWebSocketOpen();
      this.chatSocket.onclose = () => this.handleWebSocketClose();
      this.chatSocket.onerror = (error) => this.handleWebSocketError(error);
      this.chatSocket.onmessage = (event) => this.handleWebSocketMessage(event);
    }

    handleWebSocketOpen() {
      console.log("WebSocket connection opened");
      this.setWSReady(true);
      this.reconnectAttempts = 0;
    }

    handleWebSocketClose() {
      console.log("WebSocket connection closed");
      this.setWSReady(false);
      this.attemptReconnect();
    }

    handleWebSocketError(error) {
      console.error("WebSocket error:", error);
    }

    /**
     * Handles incoming WebSocket messages.
     * @param {MessageEvent} event - The WebSocket message event.
     */
    handleWebSocketMessage(event) {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);

        switch (data.type) {
          case "error":
            this.handleErrorMessage(data);
            break;
          case "sources":
            this.handleSourcesMessage(data);
            break;
          case "message":
            this.handleContentMessage(data);
            break;
          case "messageEnd":
            this.handleMessageEnd();
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    }

    handleErrorMessage(data) {
      console.error("Received error message:", data.data);
      this.showToast(data.data, "error");
      this.removeLoadingIndicator();
    }

    handleSourcesMessage(data) {
      this.currentSources = data.data;
      this.currentMessageId = data.messageId;
    }

    handleContentMessage(data) {
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

    handleMessageEnd() {
      this.removeLoadingIndicator();
      this.updateStreamingMessage(
        this.currentMessageId,
        this.currentMessageContent,
        this.currentSources,
      );
      this.messageHistory.push(["ai", this.currentMessageContent]);
      this.trimMessageHistory();
      this.saveChatHistory();
      this.resetCurrentMessageState();
    }

    resetCurrentMessageState() {
      this.currentSources = [];
      this.currentMessageId = null;
      this.currentMessageContent = "";
    }

    trimMessageHistory() {
      if (this.messageHistory.length > CONFIG.MAX_HISTORY_LENGTH) {
        this.messageHistory = this.messageHistory.slice(
          -CONFIG.MAX_HISTORY_LENGTH,
        );
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
      this.saveChatHistory();
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
      const toastContainer = document.getElementById("chat-toasts");
      if (!toastContainer) {
        console.error("Toast container not found");
        return;
      }

      const toast = document.createElement("div");
      toast.className = `chat-toast ${type}`;
      toast.textContent = message;

      toastContainer.appendChild(toast);

      // Remove the toast after 3 seconds
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    /**
     * Generates a unique identifier for messages or chat sessions.
     * @returns {string} A unique identifier string.
     */
    generateUniqueId() {
      return `${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`;
    }

    /**
     * Processes markdown content and converts it to HTML.
     * This method handles bold, italic, code blocks, and source links.
     * @param {string} content - The markdown content to process.
     * @param {Array} sources - An array of source objects.
     * @returns {string} The processed HTML content.
     */
    processMarkdown(content, sources = []) {
      let processedContent = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(\d+)\]/g, (match, p1) => {
          const sourceIndex = parseInt(p1) - 1;
          if (sources[sourceIndex]?.metadata?.url) {
            return `<a href="${sources[sourceIndex].metadata.url}" target="_blank">[${p1}]</a>`;
          }
          return match;
        });

      processedContent = processedContent.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (_, language, code) =>
          `<pre><code class="language-${language || "plaintext"}">${this.escapeHtml(code.trim())}</code></pre>`,
      );

      if (sources.length > 0) {
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
      if (window.Prism) {
        Prism.highlightAll();
      }
    }

    toggleChatWindow() {
      const isVisible = this.chatWindow.style.display === "flex";
      this.chatWindow.style.display = isVisible ? "none" : "flex";
      document.body.classList.toggle("chat-open", !isVisible);
      this.chatButton.style.display = isVisible ? "flex" : "none";
    }

    closeChatWindow() {
      this.chatWindow.style.display = "none";
      document.body.classList.remove("chat-open");
      this.chatButton.style.display = "flex";
      this.saveChatHistory();
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

    /**
     * Sends a user message to the server.
     * This method prepares the message data, sends it via WebSocket, and updates the UI.
     * @param {string} message - The user's message to send.
     */
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

      this.messageHistory.push(["human", message]);
      this.trimMessageHistory();
      this.appendMessage("user", message, messageId);
    }

    showLoadingIndicator() {
      const loadingElement = document.createElement("div");
      loadingElement.className = "message loading";
      loadingElement.innerHTML = `
        Thinking
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
      `;
      document.getElementById("chat-messages").appendChild(loadingElement);
      this.scrollToBottom();
    }

    /**
     * Attempts to reconnect to the WebSocket server.
     * This method implements an exponential backoff strategy for reconnection attempts.
     */
    attemptReconnect() {
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= CONFIG.MAX_RECONNECT_ATTEMPTS) {
        this.showToast(
          "Connection lost. Attempting to reconnect...",
          "warning",
        );
        console.log(`Reconnect attempt ${this.reconnectAttempts}`);
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
      const chatMessages = document.getElementById("chat-messages");
      if (chatMessages) {
        chatMessages.innerHTML = "";
      }
      this.chatId = this.generateUniqueId();
      this.saveChatHistory();
    }

    /**
     * Saves the current chat history to local storage.
     * This method stores both the message history and the chat ID.
     */
    saveChatHistory() {
      localStorage.setItem("chatHistory", JSON.stringify(this.messageHistory));
      localStorage.setItem("chatId", this.chatId);
    }

    /**
     * Loads the chat history from local storage.
     * This method retrieves the saved message history and chat ID, and restores the chat state.
     */
    loadChatHistory() {
      const savedHistory = localStorage.getItem("chatHistory");
      const savedChatId = localStorage.getItem("chatId");

      if (savedHistory) {
        this.messageHistory = JSON.parse(savedHistory);
        this.chatId = savedChatId || this.generateUniqueId();

        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML = "";
        this.messageHistory.forEach(([role, content]) => {
          this.appendMessage(role === "human" ? "user" : "ai", content);
        });
      } else {
        this.messageHistory = [];
        this.chatId = this.generateUniqueId();
      }
    }
  }

  /**
   * Initializes the ChatManager when the DOM is fully loaded.
   * This ensures that all required DOM elements are available before the chat is initialized.
   */
  document.addEventListener("DOMContentLoaded", () => {
    window.chatManager = new ChatManager();

    /**
     * Saves the chat history before the window is unloaded.
     * This ensures that the chat history is preserved between page reloads or navigation.
     */
    window.addEventListener("beforeunload", () => {
      window.chatManager.saveChatHistory();
    });
  });
})();
