// Bay Area Direct — AI Chat Assistant Widget
// Powered by GPT-4o-mini via Cloudflare Worker proxy
// Real conversational AI with George's knowledge base

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    // Cloudflare Worker endpoint (update after deploying worker)
    apiUrl: 'https://lingering-block-be18.dry-brook-db54.workers.dev',
    company: {
      name: "Bay Area Direct",
      phone: "(415) 877-2020",
      email: "info@bayareadirect.com",
    }
  };

  // ============================================
  // CONVERSATION STATE
  // ============================================
  let conversationHistory = [];

  // ============================================
  // INJECT CSS
  // ============================================
  function injectStyles() {
    const css = `
      #bad-ai-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      #bad-ai-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0071e3, #00c6ff);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0, 113, 227, 0.4);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
      }

      #bad-ai-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0, 113, 227, 0.5);
      }

      #bad-ai-toggle svg {
        width: 28px;
        height: 28px;
        fill: white;
      }

      #bad-ai-toggle .close-icon {
        display: none;
      }

      #bad-ai-toggle.open .chat-icon {
        display: none;
      }

      #bad-ai-toggle.open .close-icon {
        display: block;
      }

      #bad-ai-pulse {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        background: #ff3b30;
        border-radius: 50%;
        border: 2px solid white;
        animation: bad-pulse 2s infinite;
      }

      @keyframes bad-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }

      #bad-ai-chat {
        position: absolute;
        bottom: 75px;
        right: 0;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 520px;
        max-height: calc(100vh - 120px);
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: bad-slideUp 0.3s ease;
      }

      #bad-ai-chat.open {
        display: flex;
      }

      @keyframes bad-slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #bad-ai-header {
        background: linear-gradient(135deg, #1d1d1f, #2d2d2f);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      #bad-ai-header-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0071e3, #00c6ff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
      }

      #bad-ai-header-info h4 {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.01em;
      }

      #bad-ai-header-info p {
        font-size: 12px;
        color: #86868b;
        margin: 2px 0 0 0;
      }

      #bad-ai-status {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #30d158;
        border-radius: 50%;
        margin-right: 4px;
        vertical-align: middle;
      }

      #bad-ai-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f5f5f7;
      }

      #bad-ai-messages::-webkit-scrollbar {
        width: 4px;
      }

      #bad-ai-messages::-webkit-scrollbar-thumb {
        background: #c7c7cc;
        border-radius: 4px;
      }

      .bad-msg {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .bad-msg.bot {
        background: white;
        color: #1d1d1f;
        border-bottom-left-radius: 4px;
        align-self: flex-start;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }

      .bad-msg.user {
        background: #0071e3;
        color: white;
        border-bottom-right-radius: 4px;
        align-self: flex-end;
      }

      .bad-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-self: flex-start;
        padding: 4px 0;
      }

      .bad-quick-btn {
        background: white;
        border: 1.5px solid #0071e3;
        color: #0071e3;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .bad-quick-btn:hover {
        background: #0071e3;
        color: white;
      }

      .bad-typing {
        align-self: flex-start;
        background: white;
        padding: 12px 20px;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        display: flex;
        gap: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }

      .bad-typing-dot {
        width: 8px;
        height: 8px;
        background: #86868b;
        border-radius: 50%;
        animation: bad-typing 1.4s infinite;
      }

      .bad-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .bad-typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes bad-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }

      #bad-ai-input-area {
        padding: 12px 16px;
        border-top: 1px solid #e5e5e7;
        display: flex;
        gap: 10px;
        align-items: center;
        background: white;
      }

      #bad-ai-input {
        flex: 1;
        border: 1.5px solid #e5e5e7;
        border-radius: 24px;
        padding: 10px 16px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
        background: #f5f5f7;
      }

      #bad-ai-input:focus {
        border-color: #0071e3;
        background: white;
      }

      #bad-ai-input::placeholder {
        color: #86868b;
      }

      #bad-ai-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #0071e3;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      #bad-ai-send:hover {
        background: #0077ed;
      }

      #bad-ai-send:disabled {
        background: #86868b;
        cursor: not-allowed;
      }

      #bad-ai-send svg {
        width: 18px;
        height: 18px;
        fill: white;
      }

      #bad-ai-call-bar {
        background: #30d158;
        color: white;
        text-align: center;
        padding: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        text-decoration: none;
        display: block;
      }

      #bad-ai-call-bar:hover {
        background: #28b84d;
      }

      @media (max-width: 480px) {
        #bad-ai-chat {
          width: calc(100vw - 20px);
          height: calc(100vh - 100px);
          right: -10px;
          bottom: 70px;
          border-radius: 12px;
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================
  // CREATE WIDGET HTML
  // ============================================
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'bad-ai-widget';
    widget.innerHTML = `
      <div id="bad-ai-chat">
        <div id="bad-ai-header">
          <div id="bad-ai-header-avatar">🚚</div>
          <div id="bad-ai-header-info">
            <h4>Bay Area Direct Assistant</h4>
            <p><span id="bad-ai-status"></span> Online — Powered by AI</p>
          </div>
        </div>
        <a href="tel:+14158772020" id="bad-ai-call-bar">📞 Tap to Call: (415) 877-2020</a>
        <div id="bad-ai-messages"></div>
        <div id="bad-ai-input-area">
          <input type="text" id="bad-ai-input" placeholder="Ask me anything about our services..." autocomplete="off">
          <button id="bad-ai-send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
      <button id="bad-ai-toggle">
        <span class="chat-icon">
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
        </span>
        <span class="close-icon">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
        <span id="bad-ai-pulse"></span>
      </button>
    `;
    document.body.appendChild(widget);
  }

  // ============================================
  // AI API CALL
  // ============================================
  async function getAIResponse(userMessage) {
    // Add user message to history
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "Sorry, I'm having trouble right now. Please call us at (415) 877-2020 for immediate help!";

      // Add assistant reply to history
      conversationHistory.push({ role: 'assistant', content: reply });

      return reply;
    } catch (err) {
      console.error('BAD AI Chat error:', err);
      // Remove the failed user message from history
      conversationHistory.pop();
      return "I'm having a connection issue right now. The fastest way to get help is to call us directly at (415) 877-2020 — we're available 7 days a week!";
    }
  }

  // ============================================
  // WIDGET LOGIC
  // ============================================
  function initWidget() {
    const toggle = document.getElementById('bad-ai-toggle');
    const chat = document.getElementById('bad-ai-chat');
    const messages = document.getElementById('bad-ai-messages');
    const input = document.getElementById('bad-ai-input');
    const sendBtn = document.getElementById('bad-ai-send');
    const pulse = document.getElementById('bad-ai-pulse');
    let isOpen = false;
    let hasOpened = false;
    let isSending = false;

    // Toggle chat
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      toggle.classList.toggle('open', isOpen);
      if (pulse) pulse.style.display = 'none';

      if (isOpen && !hasOpened) {
        hasOpened = true;
        // Show welcome message
        setTimeout(() => {
          addBotMessage(
            "Hi there! 👋 Welcome to Bay Area Direct — your trusted same-day courier service across the Bay Area.\n\nI can help you with:\n• Legal & Court Filings\n• Medical & Lab Transport (HIPAA compliant)\n• Corporate & Rush Delivery\n• General Same-Day Delivery\n\nWhat can I help you with today?",
            ['Our Services', 'Get a Quote', 'Coverage Area', 'Call Now']
          );
        }, 400);
      }

      if (isOpen) {
        setTimeout(() => input.focus(), 300);
      }
    });

    // Send message
    async function sendMessage() {
      const text = input.value.trim();
      if (!text || isSending) return;

      isSending = true;
      sendBtn.disabled = true;
      addUserMessage(text);
      input.value = '';

      // Show typing indicator
      const typing = showTyping();

      try {
        // Handle "Call Now" quick reply
        if (text === 'Call Now') {
          typing.remove();
          addBotMessage(
            "📞 Call Bay Area Direct now:\n\n(415) 877-2020\n\nOur team is ready to help! We're available Monday–Sunday, 8am–6pm, with after-hours service for urgent deliveries.",
            ['Our Services', 'Get a Quote']
          );
        } else {
          // Get real AI response
          const reply = await getAIResponse(text);
          typing.remove();
          addBotMessage(reply, getSuggestedReplies(text, reply));
        }
      } catch (err) {
        typing.remove();
        addBotMessage(
          "I'm having trouble connecting right now. Please call us at (415) 877-2020 for immediate assistance!",
          ['Call Now']
        );
      }

      isSending = false;
      sendBtn.disabled = false;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Suggest quick replies based on context
    function getSuggestedReplies(userMsg, botReply) {
      const msg = (userMsg + ' ' + botReply).toLowerCase();

      if (msg.includes('legal') || msg.includes('court') || msg.includes('filing')) {
        return ['Get a Quote', 'Coverage Area', 'Call Now'];
      }
      if (msg.includes('medical') || msg.includes('hipaa') || msg.includes('specimen')) {
        return ['Get a Quote', 'Coverage Area', 'Call Now'];
      }
      if (msg.includes('price') || msg.includes('cost') || msg.includes('quote') || msg.includes('rate')) {
        return ['Call Now', 'Our Services'];
      }
      if (msg.includes('hour') || msg.includes('open') || msg.includes('close')) {
        return ['Our Services', 'Get a Quote', 'Call Now'];
      }
      if (msg.includes('thank') || msg.includes('great') || msg.includes('awesome')) {
        return ['Call Now'];
      }
      // Default suggestions
      return ['Our Services', 'Get a Quote', 'Call Now'];
    }

    // Add bot message
    function addBotMessage(text, quickReplies = []) {
      const msgEl = document.createElement('div');
      msgEl.className = 'bad-msg bot';
      msgEl.innerHTML = formatMessage(text);
      messages.appendChild(msgEl);

      if (quickReplies.length > 0) {
        const qrContainer = document.createElement('div');
        qrContainer.className = 'bad-quick-replies';
        quickReplies.forEach(qr => {
          const btn = document.createElement('button');
          btn.className = 'bad-quick-btn';
          btn.textContent = qr;
          btn.addEventListener('click', () => {
            input.value = qr;
            qrContainer.remove();
            sendMessage();
          });
          qrContainer.appendChild(btn);
        });
        messages.appendChild(qrContainer);
      }

      scrollToBottom();
    }

    // Add user message
    function addUserMessage(text) {
      const msgEl = document.createElement('div');
      msgEl.className = 'bad-msg user';
      msgEl.textContent = text;
      messages.appendChild(msgEl);
      scrollToBottom();
    }

    // Typing indicator
    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'bad-typing';
      typing.innerHTML = '<div class="bad-typing-dot"></div><div class="bad-typing-dot"></div><div class="bad-typing-dot"></div>';
      messages.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    // Format message text for display
    function formatMessage(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }

    // Scroll to bottom
    function scrollToBottom() {
      setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
      }, 50);
    }
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    injectStyles();
    createWidget();
    initWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
