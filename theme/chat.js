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
   * @property {string} FOCUS_MODE - Focus mode for the chat.
   * @property {string} CHAT_TITLE - The title displayed in the chat header.
   */
  // Default configuration
  const defaultConfig = {
    API_URL: "https://backend.agent.starknet.id/api",
    WS_URL: "wss://backend.agent.starknet.id/ws",
    MAX_RECONNECT_ATTEMPTS: 5,
    MAX_HISTORY_LENGTH: 10,
    FOCUS_MODE: "docChatMode",
    CHAT_TITLE: "Cairo Assistant",
    CHAT_PLACEHOLDER: "Ask anything about Cairo...",
    CHAT_DISCLAIMER:
      "This assistant is an AI-powered chatbot developed by LFG Labs, designed to help with inquiries related to Starknet and Cairo. While it strives to provide accurate and helpful responses, it cannot guarantee the completeness or accuracy of the information provided. For official information, please refer to the documentation on the website.",
  };

  // Merge with external config if it exists
  const CONFIG = {
    ...defaultConfig,
    ...(window.chatExternalConfig || {}),
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
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      `;
      // No inline styles here; moved to CSS
      return button;
    }

    createChatWindow() {
      const window = document.createElement("div");
      window.id = "chat-window";
      window.style.display = "none";
      window.innerHTML = `
        <div id="chat-header">
          <div class="header-left">
            <div id="connection-status" class="disconnected" title="Disconnected from server">⬤</div>
            <span class="chat-title">${this.escapeHtml(CONFIG.CHAT_TITLE)}</span>
          </div>
          <div class="header-right">
            <button id="clear-history" class="icon-button" title="Clear History">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
            </button>
            <button id="close-chat" class="icon-button" title="Close Chat">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input">
          <input type="text" id="message-input" placeholder="${this.escapeHtml(CONFIG.CHAT_PLACEHOLDER)}">
          <button id="send-message" class="icon-button" title="Send Message">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
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
     * Initializes the chat by connecting to WebSocket.
     * @async
     */
    async initializeChat() {
      try {
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
     * Establishes a WebSocket connection with the chat server.
     * The connection URL includes query parameters for specifying the chat and embedding models.
     */
    connectWebSocket() {
      const wsURL = new URL(CONFIG.WS_URL);
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
      this.setWSReady(true);
      this.reconnectAttempts = 0;
    }

    handleWebSocketClose() {
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
      const sendButton = this.chatWindow.querySelector("#send-message");
      sendButton.disabled = !isReady;
      const statusElement = document.getElementById("connection-status");
      if (statusElement) {
        statusElement.className = isReady ? "connected" : "disconnected";
        statusElement.title = isReady
          ? "Connected to server"
          : "Disconnected from server";
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

      if (message) {
        // remove disclaimer if it exists
        const disclaimerElement = document.querySelector(".message-disclaimer");
        if (disclaimerElement) {
          disclaimerElement.remove();
        }

        if (this.chatSocket.readyState === WebSocket.OPEN) {
          // Connection is open, send message normally
          input.value = "";
          this.sendMessageToServer(message);
          this.showLoadingIndicator();
        } else {
          // Try to connect once
          this.tryConnectAndSend(message, input);
        }
      }
    }

    tryConnectAndSend(message, input) {
      this.connectWebSocket();

      // Check if connection succeeded after a short delay
      setTimeout(() => {
        if (this.chatSocket.readyState === WebSocket.OPEN) {
          // Connection successful, send the message
          input.value = "";
          this.sendMessageToServer(message);
          this.showLoadingIndicator();
        } else {
          // Connection failed, show error toast
          this.showToast(
            "Not connected to the chat server. Please try again later.",
            "error",
          );
        }
      }, 1000); // Wait 1 second to see if connection established
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
        focusMode: CONFIG.FOCUS_MODE,
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
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("chatId");
      this.showDisclaimerIfEmpty();
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
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.innerHTML = "";

      let parsedHistory = null;
      try {
        parsedHistory = savedHistory ? JSON.parse(savedHistory) : null;
      } catch (e) {
        console.error("Error parsing chat history:", e);
        localStorage.removeItem("chatHistory");
      }

      if (parsedHistory && parsedHistory.length > 0) {
        this.messageHistory = parsedHistory;
        this.chatId = savedChatId || this.generateUniqueId();

        this.messageHistory.forEach(([role, content]) => {
          const messageElement = this.createMessageElement(
            role === "human" ? "user" : "ai",
            content,
          );
          chatMessages.appendChild(messageElement);
        });
      } else {
        this.messageHistory = [];
        this.chatId = this.generateUniqueId();
      }

      this.showDisclaimerIfEmpty();
      this.scrollToBottom();
    }

    /**
     * Checks if message history is empty and shows the disclaimer message if it is.
     */
    showDisclaimerIfEmpty() {
      if (this.messageHistory.length === 0) {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          const disclaimerElement = document.createElement("div");
          disclaimerElement.className = "message-disclaimer";
          disclaimerElement.innerHTML = CONFIG.CHAT_DISCLAIMER;
          chatMessages.prepend(disclaimerElement);
          this.scrollToBottom();
        }
      }
    }

    /**
     * Helper function to create a message element (user or AI).
     * Does NOT append to DOM or save history.
     * @param {string} role - 'user' or 'ai'
     * @param {string} content - The message content
     * @param {string|null} messageId - Optional message ID
     * @returns {HTMLElement} The created message element
     */
    createMessageElement(role, content, messageId = null) {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${role}`;
      if (messageId) {
        messageElement.id = `message-${messageId}`;
      }

      const contentElement = document.createElement("div");
      contentElement.className = "content";
      contentElement.innerHTML =
        role === "ai"
          ? this.processMarkdown(content)
          : this.escapeHtml(content);
      messageElement.appendChild(contentElement);
      return messageElement;
    }
  }

  /**
   * Initializes the ChatManager when the DOM is fully loaded.
   * This ensures that all required DOM elements are available before the chat is initialized.
   */
  function initializeChatManager() {
    window.chatManager = new ChatManager();

    /**
     * Saves the chat history before the window is unloaded.
     * This ensures that the chat history is preserved between page reloads or navigation.
     */
    window.addEventListener("beforeunload", () => {
      window.chatManager.saveChatHistory();
    });
  }

  // Check if DOM is already loaded
  if (document.readyState === "loading") {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener("DOMContentLoaded", initializeChatManager);
  } else {
    // DOM is already loaded, initialize immediately
    initializeChatManager();
  }
})();
