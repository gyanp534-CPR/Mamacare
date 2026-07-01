// @ts-nocheck
/**
 * MamaCare — ASHA/ANM Chatbot Mode
 * Simplified AI assistant for frontline health workers
 * Helps with common pregnancy questions, symptom triage, and referrals
 */

'use strict';

const ASHA_MODE = {
  isActive: false,
  chatHistory: [],
  currentLanguage: 'hinglish'
};

/**
 * Initialize ASHA chatbot mode
 */
window.initASHAChatbot = function() {
  renderASHAInterface();
  setupASHAEventListeners();
};

/**
 * Render ASHA chatbot interface
 */
function renderASHAInterface() {
  const container = document.getElementById('ashaPage');
  if (!container) return;

  container.innerHTML = `
    <div style="padding:20px 0 8px">
      <div class="sec-label">For Health Workers</div>
      <div class="sec-title">ASHA/ANM Assistant 🩺</div>
    </div>

    <!-- Info Card -->
    <div class="card" style="background:rgba(106,184,154,.08);border:1.5px solid var(--green)">
      <h3 style="font-size:15px;font-weight:600;color:var(--green);margin-bottom:10px">
        👋 Welcome, Health Worker!
      </h3>
      <p style="font-size:13px;color:var(--warm);line-height:1.7;margin-bottom:12px">
        Yeh tool frontline health workers (ASHA, ANM, Anganwadi) ke liye hai. 
        Pregnancy-related common questions, symptom assessment, aur referral guidelines ke liye AI assistant.
      </p>
      <p style="font-size:12px;color:var(--muted);line-height:1.6;background:white;padding:10px;border-radius:8px">
        ⚠️ <strong>Important:</strong> Yeh diagnostic tool NAHI hai. Serious cases mein turant qualified medical professional ko refer karein.
      </p>
    </div>

    <!-- Language Selector -->
    <div class="card">
      <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--warm)">Select Language:</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        <button class="lang-btn-asha active" data-lang="hinglish" onclick="ASHA.setLanguage('hinglish')">
          Hinglish
        </button>
        <button class="lang-btn-asha" data-lang="hindi" onclick="ASHA.setLanguage('hindi')">
          हिंदी
        </button>
        <button class="lang-btn-asha" data-lang="english" onclick="ASHA.setLanguage('english')">
          English
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--warm)">Quick Topics:</div>
      <div style="display:grid;gap:8px">
        ${ASHA_QUICK_TOPICS.map(topic => `
          <button class="btn btn-g btn-sm" style="text-align:left;justify-content:flex-start;padding:12px" onclick="ASHA.askQuickTopic('${topic.query}')">
            <span style="font-size:18px;margin-right:10px">${topic.icon}</span>
            <span>${topic.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="card">
      <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--warm)">Ask a Question:</div>
      <div class="chat-box" id="ashaChatBox" style="min-height:280px;max-height:400px">
        <div class="msg bot">
          Namaste! 🙏 Main ASHA/ANM Assistant hun. Aap pregnancy se related koi bhi sawal pooch sakte hain.
          <br><br>
          Examples:
          <br>• "39 weeks ki patient ko backache aur spotting hai. Kya karein?"
          <br>• "High BP ke symptoms kya hain?"
          <br>• "Anemia ki mahila ko kya diet suggest karein?"
        </div>
      </div>
      <div class="chat-row" style="margin-top:10px">
        <input id="ashaInput" type="text" placeholder="Type your question..." onkeydown="if(event.key==='Enter')ASHA.sendMessage()"/>
        <button class="btn btn-p btn-sm" onclick="ASHA.sendMessage()">
          <i data-lucide="send" class="app-icon-inline"></i> Ask
        </button>
      </div>
    </div>

    <!-- Referral Guidelines -->
    <div class="card" style="background:rgba(232,160,168,.08)">
      <h3 style="font-size:15px;font-weight:600;color:var(--rose);margin-bottom:10px">
        🚨 Immediate Referral Required:
      </h3>
      <ul style="font-size:12px;color:var(--warm);line-height:1.8;padding-left:20px;margin:0">
        <li>Severe bleeding (any trimester)</li>
        <li>Severe headache with vision changes</li>
        <li>Severe abdominal pain</li>
        <li>High fever (>100.4°F / 38°C)</li>
        <li>No fetal movement (after 28 weeks)</li>
        <li>Water breaking before 37 weeks</li>
        <li>Seizures or loss of consciousness</li>
        <li>Chest pain or difficulty breathing</li>
        <li>Excessive vomiting (can't keep fluids down)</li>
        <li>Blood pressure >140/90</li>
      </ul>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Quick topics for ASHA workers
 */
const ASHA_QUICK_TOPICS = [
  { icon: '🩸', label: 'Anemia Detection & Management', query: 'Pregnancy mein anemia ke symptoms kya hain aur kaise manage karein? ASHA worker ko kya guidance deni chahiye?' },
  { icon: '🤰', label: 'High-Risk Pregnancy Signs', query: 'High-risk pregnancy ke warning signs kya hain? Kis condition mein immediately refer karna chahiye?' },
  { icon: '💊', label: 'Iron & Folic Acid Distribution', query: 'IFA tablets distribute karte waqt kya instructions dein? Side effects kya ho sakte hain?' },
  { icon: '📏', label: 'Weight & BP Monitoring', query: 'Pregnancy mein normal weight gain aur BP range kya hoti hai? Red flags kya hain?' },
  { icon: '🍎', label: 'Nutrition Counseling', query: 'Pregnant mahila ke liye budget-friendly nutrition advice kya de sakte hain? Village mein kya available hai?' },
  { icon: '👶', label: 'Danger Signs in Labor', query: 'Labor ke dauran dangerous signs kya hain? Kab PHC/hospital le jana zaruri hai?' },
  { icon: '💉', label: 'Vaccination Schedule', query: 'Pregnancy mein kaun se vaccines zaruri hain aur kab lagane chahiye (TT, etc)?' },
  { icon: '🏥', label: 'When to Refer to PHC/CHC', query: 'Kis situation mein village se PHC ya CHC refer karna chahiye? Emergency vs non-emergency?' }
];

/**
 * Setup event listeners
 */
function setupASHAEventListeners() {
  // Enter key in input
  const input = document.getElementById('ashaInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendASHAMessage();
    });
  }
}

/**
 * Set language for ASHA mode
 */
function setASHALanguage(lang) {
  ASHA_MODE.currentLanguage = lang;
  
  // Update active button
  document.querySelectorAll('.lang-btn-asha').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update greeting based on language
  const greetings = {
    hinglish: 'Namaste! 🙏 Main ASHA/ANM Assistant hun. Pregnancy se related koi bhi sawal pooch sakte hain.',
    hindi: 'नमस्ते! 🙏 मैं ASHA/ANM सहायक हूँ। गर्भावस्था से संबंधित कोई भी सवाल पूछ सकते हैं।',
    english: 'Hello! 🙏 I am the ASHA/ANM Assistant. Ask me any pregnancy-related question.'
  };

  const chatBox = document.getElementById('ashaChatBox');
  if (chatBox && chatBox.children.length === 1) {
    chatBox.children[0].innerHTML = greetings[lang] + `
      <br><br>Examples:
      <br>• "39 weeks pregnant with backache and spotting. What to do?"
      <br>• "What are symptoms of high BP in pregnancy?"
      <br>• "Diet advice for anemic pregnant woman?"
    `;
  }
}

/**
 * Ask a quick topic
 */
function askQuickTopic(query) {
  const input = document.getElementById('ashaInput');
  if (input) {
    input.value = query;
    sendASHAMessage();
  }
}

/**
 * Send message to ASHA chatbot
 */
async function sendASHAMessage() {
  const input = document.getElementById('ashaInput');
  const text = input?.value?.trim();
  if (!text) return;

  input.value = '';
  appendASHAMessage(text, 'user');
  ASHA_MODE.chatHistory.push({ role: 'user', content: text });

  const typing = appendASHAMessage('...💭', 'bot', true);

  try {
    const { data, error } = await window.supa.functions.invoke('claude-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: getASHASystemPrompt(),
        messages: ASHA_MODE.chatHistory
      }
    });

    typing.remove();
    if (error) throw error;

    const reply = data?.content?.[0]?.text || '🌸 Connection issue. Dobara try karo.';
    appendASHAMessage(reply, 'bot');
    ASHA_MODE.chatHistory.push({ role: 'assistant', content: reply });

    // Track analytics
    if (window.supa && window.user) {
      window.supa.from('analytics_events').insert({
        user_id: window.user.id,
        event_name: 'asha_chatbot_query',
        event_properties: { language: ASHA_MODE.currentLanguage, query_length: text.length }
      }).then(() => {}).catch(() => {});
    }

  } catch (e) {
    typing.remove();
    appendASHAMessage('🌸 Connection issue. Dobara try karo.', 'bot');
    console.error('ASHA chatbot error:', e);
  }
}

/**
 * Get system prompt for ASHA mode based on language
 */
function getASHASystemPrompt() {
  const prompts = {
    hinglish: `You are an AI assistant for ASHA (Accredited Social Health Activist) and ANM (Auxiliary Nurse Midwife) workers in rural India. Your role is to provide practical, evidence-based guidance for frontline health workers managing pregnancy cases.

IMPORTANT GUIDELINES:
1. Always prioritize patient safety - recommend immediate referral for serious symptoms
2. Provide practical advice suitable for rural/resource-limited settings
3. Use simple, clear language (Hinglish preferred)
4. Include specific action steps and red flags
5. Mention government schemes when relevant (JSY, PMSMA, etc.)
6. Never diagnose - guide on when to refer
7. Be culturally sensitive to Indian rural context

FORMAT YOUR RESPONSE:
🔴 URGENCY: [Normal / Refer Soon / Immediate Referral]
📋 ASSESSMENT: [2-3 lines explaining the situation]
✅ ACTION STEPS: [Practical steps the health worker can take]
🚨 RED FLAGS: [Warning signs that require immediate referral]
💡 COUNSELING TIPS: [What to tell the pregnant woman/family]

Language: Respond in Hinglish (Hindi + English mix) unless specified otherwise.`,

    hindi: `आप ग्रामीण भारत में ASHA (मान्यता प्राप्त सामाजिक स्वास्थ्य कार्यकर्ता) और ANM (सहायक नर्स दाई) कार्यकर्ताओं के लिए AI सहायक हैं। आपकी भूमिका गर्भावस्था के मामलों के प्रबंधन में फ्रंटलाइन स्वास्थ्य कार्यकर्ताओं को व्यावहारिक, साक्ष्य-आधारित मार्गदर्शन प्रदान करना है।

महत्वपूर्ण दिशानिर्देश:
1. रोगी की सुरक्षा को हमेशा प्राथमिकता दें
2. ग्रामीण/संसाधन-सीमित सेटिंग्स के लिए उपयुक्त सलाह
3. सरल, स्पष्ट भाषा का उपयोग करें
4. विशिष्ट कार्रवाई कदम और खतरे के संकेत शामिल करें
5. कभी निदान न करें - केवल मार्गदर्शन दें

भाषा: हिंदी में जवाब दें।`,

    english: `You are an AI assistant for ASHA (Accredited Social Health Activist) and ANM (Auxiliary Nurse Midwife) workers in rural India. Provide practical, evidence-based guidance for frontline health workers managing pregnancy cases.

GUIDELINES:
1. Prioritize patient safety - recommend referral for serious symptoms
2. Provide practical advice for rural/resource-limited settings
3. Use simple, clear English
4. Include specific action steps and red flags
5. Mention government schemes when relevant
6. Never diagnose - guide on when to refer

FORMAT:
🔴 URGENCY: [Normal / Refer Soon / Immediate Referral]
📋 ASSESSMENT: [Situation explanation]
✅ ACTION STEPS: [What the health worker should do]
🚨 RED FLAGS: [Warning signs requiring immediate referral]
💡 COUNSELING: [What to tell the woman/family]

Language: Respond in English.`
  };

  return prompts[ASHA_MODE.currentLanguage] || prompts.hinglish;
}

/**
 * Append message to ASHA chat
 */
function appendASHAMessage(text, role, isTyping = false) {
  const box = document.getElementById('ashaChatBox');
  if (!box) return null;

  const div = document.createElement('div');
  div.className = `msg ${role}`;
  
  // Convert markdown
  div.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  
  if (isTyping) div.style.cssText = 'font-style:italic;color:var(--muted)';
  
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  
  return div;
}

/**
 * Clear chat history
 */
function clearASHAChat() {
  ASHA_MODE.chatHistory = [];
  const box = document.getElementById('ashaChatBox');
  if (box) {
    box.innerHTML = '<div class="msg bot">Namaste! 🙏 Nayi conversation shuru karte hain. Kya sawal hai?</div>';
  }
}

// Export to window
window.ASHA = {
  init: initASHAChatbot,
  setLanguage: setASHALanguage,
  askQuickTopic: askQuickTopic,
  sendMessage: sendASHAMessage,
  clear: clearASHAChat
};
