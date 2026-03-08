// Bay Area Direct — AI Phone Assistant Widget
// Built with George's Knowledge Base
// No API keys required — works offline with smart keyword matching

(function() {
  'use strict';

  // ============================================
  // KNOWLEDGE BASE (from George's System Prompt)
  // ============================================
  const KB = {
    company: {
      name: "Bay Area Direct",
      phone: "(415) 877-2020",
      email: "info@bayareadirect.com",
      address: "3291 Alfonso Drive, Concord, CA 94518",
      hours: "Monday – Sunday, 8:00 AM – 6:00 PM",
      afterHours: "After-hours and weekend service available for urgent deliveries",
      website: "https://bayareadirect.com"
    },
    services: {
      legal: {
        name: "Legal & Court Filings",
        icon: "⚖️",
        description: "Same-day court filings, document service, legal document delivery to courts, law firms, and government offices across all Bay Area counties.",
        details: [
          "Same-day court filings at all Bay Area courthouses",
          "Document service and process serving",
          "Law firm to courthouse delivery",
          "Confidential legal document transport",
          "Time-stamped proof of delivery"
        ]
      },
      medical: {
        name: "Medical & Lab Specimens",
        icon: "🏥",
        description: "HIPAA-compliant transport of medical specimens, lab samples, pharmaceuticals, and medical records with proper chain of custody.",
        details: [
          "HIPAA-compliant specimen transport",
          "Lab sample pickup and delivery",
          "Pharmaceutical deliveries",
          "Medical records transport",
          "Temperature-controlled when needed",
          "Proper chain of custody documentation"
        ]
      },
      corporate: {
        name: "Corporate & Rush Delivery",
        icon: "💼",
        description: "Time-critical business deliveries including documents, packages, and materials across the Bay Area with real-time tracking.",
        details: [
          "Rush and same-day corporate deliveries",
          "Inter-office document transport",
          "Package delivery with signature confirmation",
          "Scheduled recurring routes",
          "Real-time delivery tracking"
        ]
      },
      general: {
        name: "General Same-Day Delivery",
        icon: "📦",
        description: "Reliable same-day delivery for any package across the Bay Area. From small envelopes to larger items.",
        details: [
          "Same-day pickup and delivery",
          "Envelopes to medium packages",
          "Residential and commercial",
          "Proof of delivery provided",
          "Fully insured transport"
        ]
      }
    },
    coverage: {
      counties: ["San Francisco", "Alameda", "Contra Costa", "San Mateo", "Santa Clara"],
      cities: [
        "San Francisco", "Oakland", "Berkeley", "San Jose", "Palo Alto",
        "Concord", "Walnut Creek", "Fremont", "Redwood City", "Daly City",
        "Richmond", "Hayward", "Sunnyvale", "Mountain View", "Santa Clara",
        "San Mateo", "South San Francisco", "Pleasanton", "Livermore", "Dublin"
      ],
      keyLocations: {
        courthouses: [
          "San Francisco Superior Court (Civic Center)",
          "Alameda County Superior Court (Oakland, Hayward, Fremont)",
          "Contra Costa Superior Court (Martinez, Richmond, Walnut Creek)",
          "San Mateo County Superior Court (Redwood City)",
          "Santa Clara County Superior Court (San Jose)"
        ],
        hospitals: [
          "UCSF Medical Center", "Stanford Health Care",
          "Kaiser facilities (multiple locations)",
          "John Muir Health", "Sutter Health facilities",
          "Valley Medical Center", "Highland Hospital"
        ]
      }
    },
    pricing: {
      note: "Pricing depends on distance, urgency, and package type. Call for an exact quote.",
      factors: [
        "Pickup and delivery locations",
        "Distance between points",
        "Urgency (standard same-day vs. rush)",
        "Package size and type",
        "Special handling requirements (medical, legal)"
      ]
    },
    competitive: [
      "Locally owned and operated — we know every Bay Area shortcut",
      "HIPAA compliant for medical deliveries",
      "Fully insured and bonded",
      "Real-time delivery tracking",
      "Same-day service, 7 days a week",
      "Dedicated professional couriers (not gig workers)",
      "Time-stamped proof of delivery"
    ]
  };

  // ============================================
  // INTENT RECOGNITION & RESPONSES
  // ============================================
  const intents = [
    {
      id: 'greeting',
      patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|sup|yo|what'?s?\s*up)/i],
      response: () => `Hi there! 👋 Welcome to Bay Area Direct. I'm here to help with your delivery needs.\n\nHow can I assist you today?`,
      quickReplies: ['Our Services', 'Get a Quote', 'Coverage Area', 'Hours & Contact']
    },
    {
      id: 'services',
      patterns: [/service|what\s*(do|can)\s*you\s*(do|offer|deliver|provide)|type.*deliver/i],
      response: () => {
        const svcs = KB.services;
        return `We offer **4 main delivery services**:\n\n${svcs.legal.icon} **${svcs.legal.name}**\nSame-day court filings & legal document delivery\n\n${svcs.medical.icon} **${svcs.medical.name}**\nHIPAA-compliant specimen & lab transport\n\n${svcs.corporate.icon} **${svcs.corporate.name}**\nTime-critical business deliveries\n\n${svcs.general.icon} **${svcs.general.name}**\nReliable same-day delivery for any package\n\nWant details on any of these?`;
      },
      quickReplies: ['Legal Filing', 'Medical Transport', 'Corporate Delivery', 'Get a Quote']
    },
    {
      id: 'legal',
      patterns: [/legal|court|filing|law\s*firm|attorney|lawyer|document\s*(service|serving)|process\s*serv/i],
      response: () => {
        const s = KB.services.legal;
        return `${s.icon} **${s.name}**\n\n${s.description}\n\n✅ ${s.details.join('\n✅ ')}\n\nWe serve all Bay Area courthouses including SF Superior Court, Alameda County, Contra Costa, San Mateo, and Santa Clara.\n\n📞 Call ${KB.company.phone} for a quote!`;
      },
      quickReplies: ['Get a Quote', 'Courthouses We Serve', 'Other Services']
    },
    {
      id: 'medical',
      patterns: [/medical|specimen|lab|hipaa|hospital|pharmaceutical|health|doctor|clinic|blood|sample/i],
      response: () => {
        const s = KB.services.medical;
        return `${s.icon} **${s.name}**\n\n${s.description}\n\n✅ ${s.details.join('\n✅ ')}\n\nWe deliver to all major Bay Area hospitals including UCSF, Stanford Health, Kaiser, John Muir, and Sutter Health facilities.\n\n📞 Call ${KB.company.phone} for immediate service!`;
      },
      quickReplies: ['Get a Quote', 'Hospitals We Serve', 'Other Services']
    },
    {
      id: 'corporate',
      patterns: [/corporate|business|rush|urgent|package|office|express|fast|quick|asap|emergency/i],
      response: () => {
        const s = KB.services.corporate;
        return `${s.icon} **${s.name}**\n\n${s.description}\n\n✅ ${s.details.join('\n✅ ')}\n\nNeed something delivered ASAP? We handle rush deliveries across all 5 Bay Area counties.\n\n📞 Call ${KB.company.phone} for rush service!`;
      },
      quickReplies: ['Get a Quote', 'Coverage Area', 'Call Now']
    },
    {
      id: 'pricing',
      patterns: [/pric|cost|how\s*much|rate|fee|charge|quote|estimate|afford|cheap|expensive|budget/i],
      response: () => {
        return `💰 **Pricing Information**\n\nOur rates depend on:\n\n📍 Pickup & delivery locations\n📏 Distance between points\n⏰ Urgency (standard vs. rush)\n📦 Package size & type\n🔒 Special handling (medical, legal)\n\nFor an exact quote, the fastest way is to call us:\n\n📞 **${KB.company.phone}**\n\nOr tell me your pickup and delivery locations and I'll help you get started!`;
      },
      quickReplies: ['Call Now', 'Our Services', 'Coverage Area']
    },
    {
      id: 'coverage',
      patterns: [/coverage|area|where|deliver\s*to|location|count(y|ies)|city|cities|serve|zone|region|bay\s*area/i],
      response: () => {
        return `🗺️ **Our Coverage Area**\n\nWe cover **5 Bay Area counties**:\n\n📍 San Francisco County\n📍 Alameda County\n📍 Contra Costa County\n📍 San Mateo County\n📍 Santa Clara County\n\n**Key cities include:**\nSan Francisco, Oakland, Berkeley, San Jose, Palo Alto, Concord, Walnut Creek, Fremont, Redwood City, and many more!\n\nWe know every shortcut in the Bay Area. 🚗`;
      },
      quickReplies: ['Our Services', 'Get a Quote', 'Hours & Contact']
    },
    {
      id: 'courthouses',
      patterns: [/courthouse|court\s*house|court\s*location|which\s*court/i],
      response: () => {
        const courts = KB.coverage.keyLocations.courthouses;
        return `🏛️ **Courthouses We Serve**\n\n${courts.map(c => '📍 ' + c).join('\n')}\n\nWe handle same-day filings at all of these locations!\n\n📞 Call ${KB.company.phone} to schedule a filing.`;
      },
      quickReplies: ['Legal Services', 'Get a Quote', 'Call Now']
    },
    {
      id: 'hospitals',
      patterns: [/hospital|which\s*hospital|medical\s*(center|facility)|health\s*care/i],
      response: () => {
        const hospitals = KB.coverage.keyLocations.hospitals;
        return `🏥 **Hospitals & Medical Facilities We Serve**\n\n${hospitals.map(h => '📍 ' + h).join('\n')}\n\nAll deliveries are HIPAA compliant with proper chain of custody.\n\n📞 Call ${KB.company.phone} for medical transport.`;
      },
      quickReplies: ['Medical Services', 'Get a Quote', 'Call Now']
    },
    {
      id: 'hours',
      patterns: [/hour|when.*open|open|close|time|schedule|availab|weekend|sunday|saturday|monday/i],
      response: () => {
        return `🕐 **Business Hours**\n\n📅 ${KB.company.hours}\n\n⚡ ${KB.company.afterHours}\n\nWe're available 7 days a week to serve you!\n\n📞 ${KB.company.phone}\n📧 ${KB.company.email}`;
      },
      quickReplies: ['Our Services', 'Get a Quote', 'Call Now']
    },
    {
      id: 'contact',
      patterns: [/contact|phone|call|email|address|reach|talk|speak|human|person|agent|representative/i],
      response: () => {
        return `📞 **Contact Bay Area Direct**\n\n☎️ Phone: **${KB.company.phone}**\n📧 Email: ${KB.company.email}\n📍 Address: ${KB.company.address}\n\n🕐 ${KB.company.hours}\n\nThe fastest way to get service is to call us directly!`;
      },
      quickReplies: ['Call Now', 'Our Services', 'Coverage Area']
    },
    {
      id: 'whyUs',
      patterns: [/why|different|better|advantage|benefit|special|unique|choose|vs|compare|competitor/i],
      response: () => {
        return `⭐ **Why Choose Bay Area Direct?**\n\n${KB.competitive.map(c => '✅ ' + c).join('\n')}\n\nWe're not a gig economy app — we're dedicated professionals who know the Bay Area inside and out!`;
      },
      quickReplies: ['Our Services', 'Get a Quote', 'Call Now']
    },
    {
      id: 'hipaa',
      patterns: [/hipaa|complian|certified|insured|bonded|license|trust|safe|secure/i],
      response: () => {
        return `🔒 **Trust & Compliance**\n\n✅ **HIPAA Compliant** — Certified for medical specimen transport\n✅ **Fully Insured** — Your deliveries are protected\n✅ **Bonded** — Additional security for valuable items\n✅ **Chain of Custody** — Documented handling for sensitive materials\n✅ **Time-Stamped Proof of Delivery** — Every delivery verified\n\nYour packages are in safe hands with Bay Area Direct.`;
      },
      quickReplies: ['Medical Services', 'Legal Services', 'Get a Quote']
    },
    {
      id: 'track',
      patterns: [/track|status|where.*package|delivery\s*status|update|eta/i],
      response: () => {
        return `📍 **Delivery Tracking**\n\nWe provide real-time delivery tracking for all shipments. To check your delivery status:\n\n📞 Call us at **${KB.company.phone}**\n📧 Email: ${KB.company.email}\n\nOur team will give you an immediate update on your delivery!`;
      },
      quickReplies: ['Call Now', 'Our Services']
    },
    {
      id: 'requestPickup',
      patterns: [/pickup|pick\s*up|schedule|book|order|request|need.*deliver|send.*package|ship/i],
      response: () => {
        return `📦 **Ready to Schedule a Pickup?**\n\nGreat! The fastest way to get started:\n\n📞 **Call: ${KB.company.phone}**\nWe'll get you a quote and dispatch a courier right away!\n\nOr you can fill out our pickup request form on this page — just scroll down or click the "Request Pickup" button.\n\n⏰ Same-day service available 7 days a week!`;
      },
      quickReplies: ['Call Now', 'Our Services', 'Coverage Area']
    },
    {
      id: 'thanks',
      patterns: [/thank|thanks|thx|appreciate|helpful|great|awesome|perfect|wonderful/i],
      response: () => `You're welcome! 😊 Is there anything else I can help you with?\n\nRemember, you can always reach us at **${KB.company.phone}** for immediate assistance!`,
      quickReplies: ['Our Services', 'Get a Quote', 'Coverage Area']
    },
    {
      id: 'bye',
      patterns: [/^(bye|goodbye|see\s*ya|later|have\s*a\s*good|take\s*care|gotta\s*go)/i],
      response: () => `Goodbye! 👋 Thanks for visiting Bay Area Direct. Don't hesitate to reach out anytime at **${KB.company.phone}**. Have a great day!`,
      quickReplies: []
    }
  ];

  // Default fallback
  const fallbackResponse = {
    response: () => `I appreciate your question! For the best assistance, I'd recommend:\n\n📞 **Call us: ${KB.company.phone}**\nOur team can help with any specific questions!\n\n📧 Or email: ${KB.company.email}\n\nIs there something else I can help with?`,
    quickReplies: ['Our Services', 'Get a Quote', 'Hours & Contact', 'Call Now']
  };

  // Quick reply mapping
  const quickReplyMap = {
    'Our Services': 'services',
    'Get a Quote': 'pricing',
    'Coverage Area': 'coverage',
    'Hours & Contact': 'hours',
    'Call Now': 'callNow',
    'Legal Filing': 'legal',
    'Legal Services': 'legal',
    'Medical Transport': 'medical',
    'Medical Services': 'medical',
    'Corporate Delivery': 'corporate',
    'Courthouses We Serve': 'courthouses',
    'Hospitals We Serve': 'hospitals',
    'Other Services': 'services',
    'Why Choose Us': 'whyUs'
  };

  // ============================================
  // MATCH INTENT
  // ============================================
  function matchIntent(message) {
    const msg = message.toLowerCase().trim();
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        if (pattern.test(msg)) {
          return intent;
        }
      }
    }
    return null;
  }

  // ============================================
  // FORMAT MESSAGE (simple markdown)
  // ============================================
  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

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

      .bad-msg.bot strong {
        color: #1d1d1f;
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
            <p><span id="bad-ai-status"></span> Online — Ready to help</p>
          </div>
        </div>
        <a href="tel:+14158772020" id="bad-ai-call-bar">📞 Tap to Call: (415) 877-2020</a>
        <div id="bad-ai-messages"></div>
        <div id="bad-ai-input-area">
          <input type="text" id="bad-ai-input" placeholder="Ask about our services..." autocomplete="off">
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

    // Toggle chat
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      toggle.classList.toggle('open', isOpen);
      if (pulse) pulse.style.display = 'none';

      if (isOpen && !hasOpened) {
        hasOpened = true;
        setTimeout(() => {
          addBotMessage(
            `Hi there! 👋 Welcome to **Bay Area Direct** — your trusted same-day courier service across the Bay Area.\n\nI can help you with:\n\n⚖️ Legal & Court Filings\n🏥 Medical & Lab Transport\n💼 Corporate & Rush Delivery\n📦 General Same-Day Delivery\n\nWhat can I help you with today?`,
            ['Our Services', 'Get a Quote', 'Coverage Area', 'Call Now']
          );
        }, 500);
      }

      if (isOpen) {
        setTimeout(() => input.focus(), 300);
      }
    });

    // Send message
    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      addUserMessage(text);
      input.value = '';

      // Show typing indicator
      const typing = showTyping();

      // Process after delay (simulates thinking)
      setTimeout(() => {
        typing.remove();
        processMessage(text);
      }, 800 + Math.random() * 700);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Process user message
    function processMessage(text) {
      // Check for "Call Now" special action
      if (text === 'Call Now') {
        addBotMessage(
          `📞 **Call Bay Area Direct Now:**\n\n☎️ **${KB.company.phone}**\n\nOur team is ready to help you with your delivery needs!\n\n🕐 ${KB.company.hours}`,
          ['Our Services', 'Get a Quote']
        );
        return;
      }

      // Check quick reply mapping
      const mappedIntent = quickReplyMap[text];
      if (mappedIntent) {
        if (mappedIntent === 'callNow') {
          addBotMessage(
            `📞 **Call Bay Area Direct Now:**\n\n☎️ **${KB.company.phone}**\n\nOur team is ready to help you with your delivery needs!\n\n🕐 ${KB.company.hours}`,
            ['Our Services', 'Get a Quote']
          );
          return;
        }
        const intent = intents.find(i => i.id === mappedIntent);
        if (intent) {
          addBotMessage(intent.response(), intent.quickReplies || []);
          return;
        }
      }

      // Match intent from text
      const intent = matchIntent(text);
      if (intent) {
        addBotMessage(intent.response(), intent.quickReplies || []);
      } else {
        addBotMessage(fallbackResponse.response(), fallbackResponse.quickReplies);
      }
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
            addUserMessage(qr);
            // Remove this quick replies container
            qrContainer.remove();
            const typing = showTyping();
            setTimeout(() => {
              typing.remove();
              processMessage(qr);
            }, 600 + Math.random() * 500);
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

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
